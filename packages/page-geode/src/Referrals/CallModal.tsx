// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
import { Input } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from '../shared/types';
import CopyInline from '../shared/CopyInline';


import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Expander, LabelHelp, AccountName, IdentityIcon, Button, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex, stringToHex, hexToString, BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';
import { getCallMessageOptions } from '../shared/util';
import IpAddress from '../shared/IpAddress'
import axios from "axios";
//import IpAddressString from '../shared/IpAddressString';


interface Props {
  className?: string;
  programID?: string;
  title?: string;
  description?: string;
  moreInfoLink?: string;
  photo?: string;
  firstLevelReward?: number;
  secondLevelReward?: number;
  maximumReward?: number;
  ownerApprovedRequired?: boolean;
  payInMinimum?: number;
  claimId?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const BNtoGeode = (_num: number|undefined) => _num? _num/1000000000000: 0;
const GeodeToBN = (_num: number|undefined) => _num? _num*1000000000000: 0;
const paramToNum = (_num: number|undefined) => _num? _num : 0; 
const paramToString = (_string: string|undefined) => _string? _string : '';
const paramToBool = (_bool: boolean|undefined) => _bool? _bool: false;
const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
const refHeader: string[] = ['Make a Claim','Endorse a Claim','','Fund Program','Update Program', 'Deactivate Program', 'Activate Program', '']

function CallModal ({ className = '', programID, 
                      title, description, moreInfoLink, 
                      photo, firstLevelReward, secondLevelReward, 
                      maximumReward, ownerApprovedRequired, payInMinimum, claimId, 
                      contract, messageIndex, onCallResult, onChangeMessage,
                      onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];

  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  
  const [isViaCall, toggleViaCall] = useToggle();
  const [isOwnerApproved, toggleOwnerApproved] = useToggle(paramToBool(ownerApprovedRequired));

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  // const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000';
  // const isReply: boolean = (messageId===zeroMessageId)? false: true; 
  // NOTE!:
  // messageIndex === 0 :Post or Reply
  // messageIndex === 2 :Endorse a Public Feed Post

  // for test
  const isShow: boolean = false;
  const isShowParams: boolean = true;

  const JSONaxios: string = 'https://api.ipify.org/?format=json';
  //const _JSONaxios: string = 'https://ipapi.co/json'
  const [ip, setIP] = useState("");

  const getData = async () => {
      const res = await axios.get(JSONaxios);
      console.log(res.data);
      setIP(res.data.ip);
    };
  
    useEffect(() => {
      getData();
    }, []);


  function hextoHuman(_hexIn: string): string {
    const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '';
    return(_Out)
  }

  useEffect((): void => {
    setEstimatedWeight(null);
    setEstimatedWeightV2(null);
    setParams([]);
  }, [contract, messageIndex]);

  useEffect((): void => {
    value && message.isMutating && setExecTx((): SubmittableExtrinsic<'promise'> | null => {
      try {
        return contract.tx[message.method](
          { gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 },
          ...params
        );
      } catch (error) {
        return null;
      }
    });
  }, [accountId, contract, message, value, weight, params]);

  useEffect((): void => {
    if (!accountId || !message || !dbParams || !dbValue) {
      return;
    }

    contract
      .query[message.method](accountId, { gasLimit: -1, storageDepositLimit: null, value: message.isPayable ? dbValue : 0 }, ...dbParams)
      .then(({ gasRequired, result }) => {
        if (weight.isWeightV2) {
          setEstimatedWeightV2(
            result.isOk
              ? api.registry.createType('WeightV2', gasRequired)
              : null
          );
        } else {
          setEstimatedWeight(
            result.isOk
              ? gasRequired
              : null
          );
        }
      })
      .catch(() => {
        setEstimatedWeight(null);
        setEstimatedWeightV2(null);
      });
  }, [api, accountId, contract, message, dbParams, dbValue, weight.isWeightV2]);


  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !message || !value || !weight) {
        return;
      }

      contract
        .query[message.method](
          accountId,
          { gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.isEmpty ? -1 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 },
          ...params
        )
        .then((result): void => {
          setOutcomes([{
            ...result,
            from: accountId,
            message,
            params,
            when: new Date()
          }, ...outcomes]);
          onCallResult && onCallResult(messageIndex, result);
        })
        .catch((error): void => {
          console.error(error);
          onCallResult && onCallResult(messageIndex);
        });
    },
    [accountId, contract.query, message, messageIndex, onCallResult, outcomes, params, value, weight]
  );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));

  return (
    <>
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t<string>('Geode Referral - ' + refHeader[messageIndex])}
      onClose={onClose}
    >
      <Modal.Content>
      <h2>
      <strong>{t<string>('Program Title: ')}</strong>
          {hextoHuman(paramToString(title))}<br />
      </h2>
      <Expander 
         className='paramsExpander'
         isOpen={false}
         summary={'Instructions: '}>
        {messageIndex !== null && messageIndex===0 && (<>
            <strong>{t<string>('Instructions for Making a Claim: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Copy the Program ID and paste it into the (programId: Hash) Field. ')}<br /> 
            {'(3) '}{t<string>('Copy or Enter the Parent IP Address into the (parentId: Vec) Field. This is your current IP Address. ')}<br /> 
            {'(4) '}{t<string>('Select the Account of the Person you brought on (child: AccountID). ')}<br /> 
            {'(5) '}{t<string>('Enter the value in Geode for the Pay-it-Forward ammount (value). This amount goes to the person you brought on. ')}
            
            <br /><br />
            {t<string>('⚠️ Please Note: Click Submit to execute this funding transaction. ')}
          </>)}
          {messageIndex !== null && messageIndex===1 && (<>
            <strong>{t<string>('Instructions for Endorsing a Claim: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Copy the Program ID and paste it into the (programId: Hash) Field. ')}<br /> 
            {'(3) '}{t<string>('Copy or Enter the Parent IP Address into the (parentId: Vec) Field. This is your current IP Address. ')}<br /> 
            {'(4) '}{t<string>('Select the Account of the Person you brought on (child: AccountID). ')}<br /> 
            {'(5) '}{t<string>('Enter the value in Geode for the Pay-it-Forward ammount (value). This amount goes to the person you brought on. ')}
            
            <br /><br />
            {t<string>('⚠️ Please Note: Click Submit to execute this funding transaction. ')}
          </>)}
          {messageIndex !== null && messageIndex===3 && (<>
            <strong>{t<string>('Instructions for Funding a Program: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Enter the value in Geode to fund the Program (value). ')}
            
            <br /><br />
            {t<string>('⚠️ Please Note: Click Submit to execute this funding transaction. ')}
          </>)}
        {messageIndex !== null && messageIndex === 4 && (<>
            <strong>{t<string>('Instructions for Updating Program Information: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Enter the Program Title. ')}<br />
            {'(3) '}{t<string>('Enter the description of the program. ')}<br />
            {'(4) '}{t<string>('Website or Document Link - Enter your Website or Document Link for further information.')}<br />
            {'(5) '}{t<string>('Photo or YouTube Link -  Enter a valid Photo or YouTube Link.')}<br />
            {'(6) '}{t<string>('First Level Reward in Geode.')}<br />
            {'(7) '}{t<string>('Second Level Reward in Geode. ')}<br />
            {'(8) '}{t<string>('Maximum Number of Rewards to pay out.')}<br />
            {'(9) '}{t<string>('As the program owner do you wish to approve each award? ')}<br />
            {'(10) '}{t<string>('The minimum Amount to pay in (in Geode)')}
            <br /><br />
            {t<string>("⚠️ Please Note: You can use the copy buttons to copy and past the existing values into the form.  ")}<br />
            {t<string>('⚠️ Caution: You must fill in each field before submitting.')} <br /><br />        
          </>)}
        {messageIndex !== null && messageIndex === 5 && (<>
            <strong>{t<string>('Instructions for Deactiving a Program: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Click Submit to Deactivate the Program. ')}<br />
            <br /><br />
            {t<string>("⚠️ Please Note: Don't Forget to Click Submit when done! ")}<br /><br />
          </>)}
          {messageIndex !== null && messageIndex === 6 && (<>
            <strong>{t<string>('Instructions for Reactiving a Program: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Enter the Program value in Geode. ')}
            {'(3) '}{t<string>('Click Submit to Reactivate the Program. ')}<br />
            <br /><br />
            {t<string>("⚠️ Please Note: Don't Forget to Click Submit when done! ")}<br /><br />
          </>)}
        </Expander>
        
        {isShow && (<>
          <InputAddress
          //help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t<string>('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}
        <br /><strong>{t<string>('Account to Use: ')}</strong><br />
        <InputAddress
          defaultValue={accountId}
          //help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t<string>('call from account')}
          labelExtra={
            <Available
              label={t<string>('transferrable')}
              params={accountId}
            />
          }
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        {messageIndex !== null && (
          <>
            {isShow && (<>
              <Dropdown
              defaultValue={messageIndex}
              //help={t<string>('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={message === null}
              label={t<string>('message to send')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
            />            
            </>)}
        {isShow && (
        <>
          <Expander 
            className='paramsExpander'
            isOpen={false}
            summary={'See Params List'}>
            {isShowParams && (<>
              <Params
              onChange={setParams}
              params={message? message.args: undefined}
              registry={contract.abi.registry}
            />            
            </>)}
          </Expander>   
        </>
        )}
        </>
        )}

        {messageIndex===0 && (<>
          <strong>{t<string>('Copy & Paste Program ID and Parent IP Address Below: ')}</strong><br /><br />          
          <LabelHelp help={programID}/>{' '}          
          <strong>{t<string>('Program Id: ')}</strong>{programID}{' '}
          <CopyInline value={programID} label={''}/>{' '}<br /><br />
          <LabelHelp help={ip}/>{' '}          
          <strong>{t<string>('Parent IP: ')}</strong>{ip}{' '} 
          <CopyInline value={ip} label={''}/>{' '}<br /><br />
              <Params
              onChange={setParams}
              params={message? message.args: undefined}
              registry={contract.abi.registry}
              />
        </>)}

        {messageIndex===1 && (<>
          <strong>{t<string>('Copy & Paste Claim ID and Your IP Address Below: ')}</strong><br /><br />          
          <LabelHelp help={claimId}/>{' '}          
          <strong>{t<string>('Claim Id: ')}</strong>{claimId}{' '}
          <CopyInline value={claimId} label={''}/>{' '}<br /><br />
          <LabelHelp help={ip}/>{' '}          
          <strong>{t<string>('Your IP: ')}</strong>{ip}{' '} 
          <CopyInline value={ip} label={''}/>{' '}<br /><br />
              <Params
              onChange={setParams}
              params={message? message.args: undefined}
              registry={contract.abi.registry}
              />
        </>)}


        {(messageIndex===3 || messageIndex===5 || messageIndex===6) && (<>
              <br />
              <strong>{t<string>('Program Id: ')}</strong>
              {params[0] = programID} <br /><br />
              {(messageIndex===3 || messageIndex===6) && (<>
                <strong>{t<string>('Program Value: ')}</strong>              
              </>)}
        </>)}
        {(messageIndex===7) && (<>
              <br />
              <strong>{t<string>('Claim Id: ')}</strong>
              {params[0] = claimId} <br /><br />
              
        </>)}
      
        {messageIndex===4 && (<>
          <br />
          <LabelHelp help={programID}/>{' '}          
          <strong>{t<string>('Program Id: ')}</strong>
          <CopyInline value={programID} label={''}/>{' '}
          {params[0] = programID}<br /><br />   

          <LabelHelp help={t<string>(hextoHuman(paramToString(title)))}/>{' '}          
          <strong>{t<string>('Program Title: ')}</strong>
          <CopyInline value={hextoHuman(paramToString(title))} label={''}/>{' '}
          <Input label='' type="text"
            value={params[1]}
            onChange={(e) => {
              params[1] = e.target.value;
              setParams([...params]);
            }}
          />
          <LabelHelp help={t<string>(hextoHuman(paramToString(description)))}/>{' '}          
          <strong>{t<string>('Description: ')}</strong>
          <CopyInline value={hextoHuman(paramToString(description))} label={''}/>{' '}
          <Input label='' type="text"
            value={params[2]}
            onChange={(e) => {
              params[2] = e.target.value;
              setParams([...params]);
            }}
          />
          <LabelHelp help={hexToString(moreInfoLink)}/>{' '}          
          <strong>{t<string>('Link to More Information: ')}</strong>
          <CopyInline value={hextoHuman(paramToString(moreInfoLink))} label={''}/>{' '}
          <Input label='' type="text"
            value={params[3]}
            onChange={(e) => {
              params[3] = e.target.value;
              setParams([...params]);
            }}
          />
          <LabelHelp help={hextoHuman(paramToString(photo))}/> {' '}         
          <strong>{t<string>('Link to Photo or YouTube Video: ')}</strong>
          <CopyInline value={hextoHuman(paramToString(photo))} label={''}/>{' '}
          <Input label='' type="text"
            value={params[4]}
            onChange={(e) => {
              params[4] = e.target.value;
              setParams([...params]);
            }}
          />
          <LabelHelp help={paramToNum(firstLevelReward) + ' Geode'}/>{' '}          
          <strong>{t<string>('First Level Reward: ')}</strong>
          <CopyInline value={(paramToNum(firstLevelReward)).toString()} label={''}/>{' '}
          <Input label='' type="text"
            value={params[5]}
            onChange={(e) => {
              params[5] = e.target.value;
              setParams([...params]);
            }}
          />
          <LabelHelp help={paramToNum(secondLevelReward) + ' Geode'}/> {' '}         
          <strong>{t<string>('Second Level Reward: ')}</strong>
          <CopyInline value={(paramToNum(secondLevelReward)).toString()} label={''}/>{' '}
          <Input label='' type="text"
            value={params[6]}
            onChange={(e) => {
              params[6] = e.target.value;
              setParams([...params]);
            }}
          />
          <LabelHelp help={(paramToNum(maximumReward)).toString()}/> {' '}         
          <strong>{t<string>('Maximum Number of Rewards: ')}</strong>
          <CopyInline value={(paramToNum(maximumReward)).toString()} label={''}/>{' '}
          <Input label='' type="text"
            value={params[7]}
            onChange={(e) => {
              params[7] = e.target.value;
              setParams([...params]);
            }}
          />
          
          <br /><br />
          <LabelHelp help={boolToString(paramToBool(ownerApprovedRequired))}/> {' '}         
          <strong>{t<string>('Program Owner Approval Required: ')}</strong>
          <br />
          <Toggle
            className='booleantoggle'
            label={<strong>{t<string>(boolToString(!isOwnerApproved))}</strong>}
            onChange={() => {
              toggleOwnerApproved()
              params[8] = isOwnerApproved;
              setParams([...params]);
            }}
            value={isOwnerApproved}
          />
            <Input label='' type="text"
            value={params[8]}
            onChange={(e) => {
              params[8] = e.target.value;
              setParams([...params]);
            }}
          />

          <br /><br />  
          <LabelHelp help={(paramToNum(payInMinimum)).toString() + ' Geode '}/>{' '}          
          <strong>{t<string>('Minimum Amount to Pay In: ')}</strong>
          <CopyInline value={paramToNum(payInMinimum).toString()} label={''}/>{' '}
          <Input label='' type="text"
            value={params[9]}
            onChange={(e) => {
              params[9] = e.target.value;
              setParams([...params]);
            }}
          />
  
        </>)}


        {message.isPayable && (
          <InputBalance
            //help={t<string>('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
            isError={!isValueValid}
            isZeroable
            label={t<string>('value')}
            onChange={setValue}
            value={value}
          />
        )}
        {isShow && (
          <>
        <InputMegaGas
          estimatedWeight={message.isMutating ? estimatedWeight : MAX_CALL_WEIGHT}
          estimatedWeightV2={message.isMutating
            ? estimatedWeightV2
            : api.registry.createType('WeightV2', {
              proofSize: new BN(1_000_000),
              refTIme: MAX_CALL_WEIGHT
            })
          }
          help={t<string>('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
          isCall={!message.isMutating}
          weight={weight}
        />          
        </>
        )}
        {isShow && message.isMutating && (
          <Toggle
            className='rpc-toggle'
            label={t<string>('read contract only, no execution')}
            onChange={toggleViaCall}
            value={isViaCall}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        {isViaRpc
          ? (
            <Button
              icon='sign-in-alt'
              isDisabled={!isValid}
              label={t<string>('View')}
              onClick={_onSubmitRpc}
            />
          )
          : (
            <>
            { <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t<string>('Submit')}
              onStart={onClose}
            />
            }
            </>
          )
        }
      </Modal.Actions>
    </Modal>
  </>);
  
}

export default React.memo(styled(CallModal)`
  .rpc-toggle {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  .clear-all {
    float: right;
  }
  .outcomes {
    margin-top: 1rem;
  }
`);
