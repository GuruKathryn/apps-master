// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
import { Input, Label } from 'semantic-ui-react'

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
import { isHex, stringToHex, hexToString, hexToNumber, BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';
import { getCallMessageOptions } from '../shared/util';
//import IpAddress from '../shared/IpAddress'
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
//const BNtoGeode = (_num: number|undefined) => _num? _num/1000000000000: 0;
//const GeodeToBN = (_num: number|undefined) => _num? _num*1000000000000: 0;
const paramToNum = (_num: number|undefined) => _num? _num : 0; 
//const hexParamToString = (_hex: number|undefined) => _hex? hexToString((_hex).toString()): '0';
const paramToString = (_string: string|undefined) => _string? _string : '';
const paramToBool = (_bool: boolean|undefined) => _bool? _bool: false;
const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
const refHeader: string[] = ['Make a Claim','Endorse a Claim','','Fund Program','Update Program', 'Deactivate Program', 'Activate Program', 'Claim Approval', 'Reject a Claim']

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
  const [childAccountId, setChildAccountId] = useAccountId();

  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  
  const [titleValue, setTitleValue] = useState<string>();
  const [descriptionValue, setDescriptionValue] = useState<string>();
  const [moreInfoValue, setMoreInfoValue] = useState<string>();
  const [photoValue, setPhotoValue] = useState<string>();
  const [payInValue, setPayInValue] = useState<string>();
  const [firstInValue, setFirstInValue] = useState<string>();
  const [secondInValue, setSecondInValue] = useState<string>();
  const [maxRewardValue, setMaxRewardValue] = useState<string>();

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

    function GeodeToZeo(_string: string): string {
      const _num = +_string * 1000000000000;
      return(_num.toString())
    }

    function ZeoToGeode(_num: number): string {
      //const _num = +_string / 1000000000000;
      return((_num/1000000000000).toString())
    }
    // function BNtoGeode(_num: number): JSX.Element {
    //   return(<>
    //       {_num>0? <>{(_num/1000000000000).toString()}{' Geode'}</>: <>{'0'}</>}
    //   </>)
    // }


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
            {'(2) '}{t<string>('Select the Account of the Person you brought on (child: AccountID). ')}<br /> 
            {'(3) '}{t<string>('Enter the value in Geode for the Pay-it-Forward ammount (value). This amount goes to the person you brought on. ')}
            
            <br /><br />
            {t<string>('⚠️ Please Note: Click Submit to execute this funding transaction. ')}
          </>)}
          {messageIndex !== null && messageIndex===1 && (<>
            <strong>{t<string>('Instructions for Endorsing a Claim: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Click Submit to execute this funding transaction. ')}<br /> 
            <br /><br />
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
            {'(2) '}{t<string>('Enter the Program value in Geode. ')}<br />
            {'(3) '}{t<string>('Click Submit to Reactivate the Program. ')}<br />
            <br /><br />
            {t<string>("⚠️ Please Note: Don't Forget to Click Submit when done! ")}<br /><br />
          </>)}
          {messageIndex !== null && messageIndex === 7 && (<>
            <strong>{t<string>('Instructions for Approving a Claim: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Click Submit to Approve this claim. ')}<br />
            <br /><br />
            {t<string>("⚠️ Please Note: Don't Forget to Click Submit when done! ")}<br /><br />
          </>)}
          {messageIndex !== null && messageIndex === 8 && (<>
            <strong>{t<string>('Instructions for Rejecting a Claim: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t<string>('Click Submit to Reject this claim. ')}<br />
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
          <LabelHelp help={'Program ID'}/>{' '}    
          <strong>{t<string>('Program Id: ')}</strong>{params[0] = programID}{' '}
          <CopyInline value={programID} label={''}/>{' '}<br /><br />
          <LabelHelp help={'Parent Ip Address'}/>{' '}          
          <strong>{t<string>('Parent IP: ')}</strong>{params[1] = ip}{' '} 
          <CopyInline value={ip} label={''}/>{' '}<br /><br />

          <LabelHelp help={'Account of user that has been referred (Child Account)'}/>{' '}    
          <strong>{t<string>('Child Account: ')}</strong><br />
          <InputAddress
           defaultValue={childAccountId}
           //help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
           label={t<string>('Child Account')}
           labelExtra={
             <Available
               label={t<string>('transferrable')}
               params={childAccountId}
             />
            }
           onChange={setChildAccountId}
           type='account'
           value={params[2]=childAccountId}
        />
        <LabelHelp help={'Value of amount to pass to Child Account '}/>{' '}    
        <strong>{t<string>('Value: ')}</strong>
        </>)}

        {messageIndex===1 && (<>
          <LabelHelp help={'This is the Claim ID'}/>{' '}   
          <strong>{t<string>('Claim Id: ')}</strong>{params[0] = claimId}{' '}
          <CopyInline value={claimId} label={''}/>{' '}<br /><br />
          <LabelHelp help={'This is the Your IP Address'}/>{' '}          
          <strong>{t<string>('Your IP: ')}</strong>{params[1] = ip}{' '} 
          <CopyInline value={ip} label={''}/>{' '}<br /><br />
        </>)}


        {(messageIndex===3 || messageIndex===5 || messageIndex===6) && (<>
              <br />
              <strong>{t<string>('Program Id: ')}</strong>
              {params[0] = programID} <br /><br />
              {(messageIndex===3 || messageIndex===6) && (<>
                <strong>{t<string>('Program Value: ')}</strong>              
              </>)}
        </>)}
        {(messageIndex===7 || messageIndex===8) && (<>
              <br />
              <strong>{t<string>('Claim Id: ')}</strong>
              {params[0] = claimId} <br /><br />
              
        </>)}
      
        {messageIndex===4 && (<>
          <br />
          <LabelHelp help={t<string>('This is the Program ID.')}/>{' '}          
          <strong>{t<string>('Program Id: ')}</strong>
          <CopyInline value={programID} label={''}/>{' '}
          {params[0] = programID}<br /><br />   

          <LabelHelp help={t<string>('Enter the Program Title.')}/>{' '}          
          <strong>{t<string>('Program Title: ')}</strong>
          <Input label={titleValue? params[1]=titleValue: params[1]=hextoHuman(paramToString(title))}
            type="text"
            defaultValue={hextoHuman(paramToString(title))}
            value={titleValue}
            onChange={(e) => {
              setTitleValue(e.target.value);
            }}
            ><input />
            <Label color={params[1]? 'blue': 'orange'}>
                    {params[1]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t<string>('Enter the Program Description.')}/>{' '}          
          <strong>{t<string>('Description: ')}</strong>
          <Input label={descriptionValue? params[2]=descriptionValue: params[2]=hextoHuman(paramToString(description))}
            type="text"
            value={descriptionValue}
            defaultValue={hextoHuman(paramToString(description))}
            onChange={(e) => {
              setDescriptionValue(e.target.value);
            }}
            ><input />
            <Label color={params[2]? 'blue': 'orange'}>
                    {params[2]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t<string>('Enter the link to more Program Info.')}/>{' '}          
          <strong>{t<string>('Link to More Information: ')}</strong>
          <Input label={moreInfoValue? params[1]=moreInfoValue: params[3]=hextoHuman(paramToString(moreInfoLink))}
            type="text"
            value={moreInfoValue}
            defaultValue={hextoHuman(paramToString(moreInfoLink))}
            onChange={(e) => {
                setMoreInfoValue(e.target.value);
            }}
            ><input />
            <Label color={params[3]? 'blue': 'orange'}>
                    {params[3]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t<string>('Enter the link to a Photo or YouTube Video.')}/> {' '}         
          <strong>{t<string>('Link to Photo or YouTube Video: ')}</strong>
          <Input label={photoValue? params[4]=photoValue: params[4]=hextoHuman(paramToString(photo))} 
            type="text"
            value={photoValue}
            defaultValue={hextoHuman(paramToString(photo))}
            onChange={(e) => {
              setPhotoValue(e.target.value);
            }}
            ><input />
            <Label color={params[4]? 'blue': 'orange'}>
                    {params[4]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>
          
          <LabelHelp help={t<string>('Enter the First Level Reward in Geode.')}/>{' '}          
          <strong>{t<string>('First Level Reward: ')}</strong>
          <Input label='' 
            type="text"
            defaultValue={ZeoToGeode(paramToNum(firstLevelReward))}
            value={firstInValue}
            onChange={(e) => {
              setFirstInValue(e.target.value);
            }}
          ><input />
          <Label basic>{firstInValue? params[5] = GeodeToZeo(firstInValue):
                        params[5] = paramToNum(firstLevelReward)}
                       <br />{' zeolites'}</Label></Input>

          <LabelHelp help={t<string>('Enter the Second Level Reward in Geode.')}/> {' '}         
          <strong>{t<string>('Second Level Reward: ')}</strong>
          <Input label=''
            type="text"
            defaultValue={ZeoToGeode(paramToNum(secondLevelReward))}
            value={secondInValue}
            onChange={(e) => {
              setSecondInValue(e.target.value);
            }}
          ><input />
          <Label basic>{secondInValue? params[6] = GeodeToZeo(secondInValue): 
                      params[6]=paramToNum(secondLevelReward)}
                       <br />{' zeolites'}</Label>
          </Input>
        
          <LabelHelp help={t<string>('Enter the Maximum Number of Rewards.')}/> {' '}         
          <strong>{t<string>('Maximum Number of Rewards: ')}</strong>
          <Input label={maxRewardValue? params[7]=maxRewardValue: params[7]=paramToNum(maximumReward)}  
            type="text"
            value={maxRewardValue}
            defaultValue={paramToNum(maximumReward).toString()}
            onChange={(e) => {
              setMaxRewardValue(e.target.value);
            }}
            ><input />
            <Label color={params[7]? 'blue': 'orange'}>
                    {params[7]? <>{'OK'}</>:<>{'Enter Value'}</>}
                    </Label></Input>
          
          <br /><br />
          <LabelHelp help={t<string>('Select Yes/No for Program Owner Approval.')}/> {' '}         
          <strong>{t<string>('Program Owner Approval Required: ')}</strong>
          <br /><br />
          <Toggle
            className='booleantoggle'
            label={<strong>{t<string>(boolToString(isOwnerApproved))}</strong>}
            onChange={() => {
              toggleOwnerApproved()
              params[8] = !isOwnerApproved;
              setParams([...params]);
            }}
            value={isOwnerApproved}
          />

          <br />
          <LabelHelp help={t<string>('Enter the Minimum Amount to Pay Forward.')}/>{' '}          
          <strong>{t<string>('Minimum Amount to Pay In: ')}</strong>
          <Input label='' type="text"
            defaultValue={ZeoToGeode(paramToNum(payInMinimum))}
            value={payInValue}
            onChange={(e) => {
              setPayInValue(e.target.value);
            }}
          ><input />
          <Label basic>{payInValue? params[9] = GeodeToZeo(payInValue): 
                      params[9]=paramToNum(payInMinimum)}
                       <br />{'  zeolites'}</Label></Input>
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
