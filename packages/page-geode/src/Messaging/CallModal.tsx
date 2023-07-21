// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
import { Input, Label } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
//import type { CallResult } from '../shared/types';
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
import { toAddress } from '@polkadot/react-components/util';

interface Props {
  className?: string;
  messageId: string;
  fromAcct?: string;
  toAcct?: string;
  username?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallModal ({ className = '', messageId, fromAcct, toAcct, username, contract, messageIndex, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];

  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
//  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
//  const _defaultRecipient ='5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc';
//  const [recipientValue, setRecipientValue] = useAccountId(_defaultRecipient);
  const [recipientValue, setRecipientValue] = useAccountId(toAcct);
  const [messageValue, setMessageValue] = useState<string>('');
  const [fileLinkValue, setFileLinkValue] = useState<string>('')
  
  const [isViaCall, toggleViaCall] = useToggle();

  const paramToString = (_string: string|undefined) => _string? _string : '';


  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const refHeader: string[] = ['','Send a Message','','','Disallow Account','','Unblock Account','']
  //const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000';
  //const isReply: boolean = (messageId===zeroMessageId)? false: true; 
  // NOTE!:

  // for test
  const isShow: boolean = false;
  //const isShowParams: boolean = true;

  // function hextoHuman(_hexIn: string): string {
  //   const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '';
  //   return(_Out)
  // }

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

  // const _onSubmitRpc = useCallback(
  //   (): void => {
  //     if (!accountId || !message || !value || !weight) {
  //       return;
  //     }

  //     contract
  //       .query[message.method](
  //         accountId,
  //         { gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.isEmpty ? -1 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 },
  //         ...params
  //       )
  //       .then((result): void => {
  //         setOutcomes([{
  //           ...result,
  //           from: accountId,
  //           message,
  //           params,
  //           when: new Date()
  //         }, ...outcomes]);
  //         onCallResult && onCallResult(messageIndex, result);
  //       })
  //       .catch((error): void => {
  //         console.error(error);
  //         onCallResult && onCallResult(messageIndex);
  //       });
  //   },
  //   [accountId, contract.query, message, messageIndex, onCallResult, outcomes, params, value, weight]
  // );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  //const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));

  return (
    <>
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={(messageIndex!== null)? 
              t<string>('Geode - ' + refHeader[messageIndex]):
              t<string>('Geode')}
      onClose={onClose}
    >
      <Modal.Content>
      <Expander 
         className='paramsExpander'
         isOpen={false}
         summary={'Instructions: '}>
        {messageIndex===1 && (<>
          <h2><strong>{t<string>('Private Messaging - Send a Message')}</strong></h2><br />
            <strong>{t<string>('Instructions for Sending a Message: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Select the To Account')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ Please Note: Go to Allowed Accounts to add accounts to your message list.')}
          </>)}
          {messageIndex===4 && (<>
          <h2><strong>{t<string>('Private Messaging - Disallow an Account')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the your Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Select the To Account to Disallow (disallow: AccountId) ')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: You can add accounts by clicking the Add button.')}
          </>)}
          {messageIndex===6 && (<>
          <h2><strong>{t<string>('Private Messaging - Unblock an Account')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the your Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Select the To Account to Unblock (unblock: AccountId) ')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: You can Block accounts by clicking the Block button.')}
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
              <Params
              onChange={setParams}
              params={message? message.args: undefined}
              registry={contract.abi.registry}
            />    
            </>)}  
            {messageIndex===1 && (<>
              <br />
              <LabelHelp help={t<string>('Select Message Recipient.')}/>{' '}          
              <strong>{t<string>('Message Recipient: ')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={paramToString(toAcct)}
                label={t<string>('Recipient Account')}
                labelExtra={
                <Available
                    label={t<string>('transferrable')}
                    params={recipientValue}
                />
                }
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />

              <LabelHelp help={t<string>('Enter your message here..')}/>{' '}          
              <strong>{t<string>('Message: ')}</strong>
              <Input 
                label={messageValue? params[1]=messageValue: params[1]=''}
                type="text"
                //defaultValue={''}
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t<string>('Enter a link to a file.')}/>{' '}          
          <strong>{t<string>('File Link: ')}</strong>
          <Input 
            label={fileLinkValue? params[2]=fileLinkValue: params[2]=''}
            type="text"
            value={fileLinkValue}
            //defaultValue={''}
            onChange={(e) => {
              setFileLinkValue(e.target.value);
              setParams([...params]);
            }}
            ><input />
            <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>            
            </>)}      
        </>
        )}

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
        <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t<string>('Submit')}
              onStart={onClose}
        />
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