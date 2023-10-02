// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
import { Input, Label } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Expander, LabelHelp, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex, hexToString, BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';
import { getCallMessageOptions } from '../shared/util';

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
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [recipientValue, setRecipientValue] = useAccountId(toAcct);
  const [messageValue, setMessageValue] = useState<string>('');
  const [fileLinkValue, setFileLinkValue] = useState<string>('');
  const [_isHide, toggleIsHide] = useToggle(false);

  const [isViaCall, toggleViaCall] = useToggle();

  const paramToString = (_string: string|undefined) => _string? _string : '';
  const hexToHuman =(_string: string|undefined) => isHex(_string)? hexToString(_string): '';
  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';


  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const refHeader: string[] = 
  ['','Send a Message','Send a Message to a Group','','Disallow Account',
   '','Unblock Account','Delete a Message','','',
   'Join a Group','Delete Sent Messages from a Group','','Leave a Group','Update Group Settings',
   'Send a Message To a List','','','Delete a List','Join a List', 'Unsubscribe', 
   'Send a Message To A Paid List','','Delete a Paid List'];
  // NOTE!:
  // for test
  const isShow: boolean = false;

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

  const isValid = !!(accountId && weight.isValid && isValueValid);

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
            {'(2) '}{t<string>('Select the To Account (Account to receive your message.)')}<br />
            {'(3) '}{t<string>('Enter a message.')}<br />
            {'(4) '}{t<string>('You can add a File Link if you wish or leave blank.')}<br />           
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ Please Note: Go to Allowed Accounts to add accounts to your message list.')}
          </>)}
          {messageIndex===2 && (<>
          <h2><strong>{t<string>('Private Messaging - Send a Message to a Group')}</strong></h2><br />
            <strong>{t<string>('Instructions for Sending a Message to a Group: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Enter a message text to send to the Group')}<br />
            {'(3) '}{t<string>('Add a file URL')}<br />
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===4 && (<>
          <h2><strong>{t<string>('Private Messaging - Disallow an Account')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Select the To Account to Disallow (disallow: AccountId) ')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: You can add accounts by clicking the Add button.')}
          </>)}
          {messageIndex===6 && (<>
          <h2><strong>{t<string>('Private Messaging - Unblock an Account')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Select the To Account to Unblock (unblock: AccountId) ')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: You can Block accounts by clicking the Block button.')}
          </>)}
          {messageIndex===7 && (<>
          <h2><strong>{t<string>('Private Messaging - Delete a Message')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will permantely delete this message.')}
          </>)}
          {messageIndex===10 && (<>
          <h2><strong>{t<string>('Private Messaging - Join a Group')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===11 && (<>
          <h2><strong>{t<string>('Private Messaging - Delete messages sent to a Group')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will permanently delete ALL your messages to this Group.')}
          </>)}
          {messageIndex===13 && (<>
          <h2><strong>{t<string>('Private Messaging - Leave a Group')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===14 && (<>
          <h2><strong>{t<string>('Private Messaging - Update Group Settings')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Update the Group Name')}<br /> 
            {'(3) '}{t<string>('Select YES if this Group is Private')}<br /> 
            {'(4) '}{t<string>('Update the Group description')}<br /> 
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===15 && (<>
          <h2><strong>{t<string>('Private Messaging - Send a Message to a List')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Enter a message to send.')}<br /> 
            {'(3) '}{t<string>('You can send a file link or leave this field blank.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===18 && (<>
          <h2><strong>{t<string>('Private Messaging - Delete a List')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will delete the List and all its messages.')}
          </>)}
          {messageIndex===19 && (<>
          <h2><strong>{t<string>('Private Messaging - Join a List')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will add you to this List and all its messages.')}
          </>)}
          {messageIndex===20 && (<>
          <h2><strong>{t<string>('Private Messaging - Unsubscribe from a List')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will unsubscribe you from the List and all its messages.')}
          </>)}
          {messageIndex===21 && (<>
          <h2><strong>{t<string>('Private Messaging - Send a Message to a PAID List')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Enter a message to send to the list.')}<br />
            {'(3) '}{t<string>('Add a File URL for more information.')}<br />
            {'(4) '}{t<string>('Enter a Value that will be paid out to the accounts that will view this message.')}<br />
            {t<string>('⚠️ NOTE: The value must be great than or equal to the Total Fee listed for the Paid List.')}<br />
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will send a message to all Accounts in the Paid List.')}
          </>)}
          {messageIndex===23 && (<>
          <h2><strong>{t<string>('Private Messaging - Delete a PAID List')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t<string>('⚠️ NOTE: This will delete the Paid List and all its messages.')}
          </>)}
        </Expander>
        <br />
        {isShow && (<>
          <InputAddress
          isDisabled
          label={t<string>('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}

        <InputAddress
          defaultValue={accountId}
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
            {messageIndex===25 && <>
              <h2>
              <LabelHelp help={t<string>('Name of the List to UnBlock.')}/>{' '}          
                <strong>{t<string>('UnBlock a List:')}</strong><br /><br />
                <strong>{t<string>('List Id: ')}</strong>{' '}
                {params[0] = toAcct}<br />  
              </h2>
            </>}
            {messageIndex===24 && <>
              <h2>
              <LabelHelp help={t<string>('Name of the List to Block.')}/>{' '}          
                <strong>{t<string>('Block List: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('List Id: ')}</strong>{' '}
                {params[0] = toAcct}<br />  
              </h2>
            </>}
            {(messageIndex===20 || messageIndex===23) &&(<>
              <h2>
              {messageIndex===20? <>
                <LabelHelp help={t<string>('Name of the List to Unsubscribe From.')}/>{' '}          
                <strong>{t<string>('Unsubscribe from: ')}{hexToHuman(username)}</strong><br /><br />
                <LabelHelp help={t<string>('This is the List Id for the List to Unsubscribe.')}/>{' '}          
              </>: <>
                <LabelHelp help={t<string>('Name of the Paid List to Delete.')}/>{' '}          
                <strong>{t<string>('Delete Paid List: ')}{hexToHuman(username)}</strong><br /><br />
                <LabelHelp help={t<string>('This is the List Id for the List to Delete.')}/>{' '}          
              </>}
              <strong>{t<string>('List Id: ')}</strong>{' '}
              {params[0] = messageId}<br />  
              </h2>       
            </>)}

            {messageIndex===19 && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the List to Join.')}/>{' '}          
              <strong>{t<string>('Join: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the List Id for the List to Join.')}/>{' '}          
              <strong>{t<string>('List Id: ')}</strong>{' '}
              {params[0] = messageId}
              </h2> 
            </>)}

            {messageIndex===18 && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the List to Delete.')}/>{' '}          
              <strong>{t<string>('Delete: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the List Id for the List to Delete.')}/>{' '}          
              <strong>{t<string>('List Id: ')}</strong>{' '}
              {params[0] = messageId}
              </h2>       
            </>)}

            {(messageIndex===15 || messageIndex===21) && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the List to Send a Message.')}/>{' '}          
              <strong>{t<string>('Send Message To: ')}{hexToHuman(username)}</strong></h2>
              <h3><strong>{t<string>('⚠️ PLEASE NOTE: You can only send messages to Lists that you created and own.')}</strong></h3>
              <br />
              <LabelHelp help={t<string>('This is the List Id for the List to Send a Message.')}/>{' '}          
              <strong>{t<string>('List Id: ')}</strong>{' '}
              {messageIndex===15? params[0] = toAcct: params[0] = messageId}
              <br /><br />
              <LabelHelp help={t<string>('Enter your message here..')}/>{' '}          
              <strong>{t<string>('Message: ')}</strong>
              <Input 
                label={messageValue? params[1]=messageValue: params[1]=''}
                type="text"
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a link to a file.')}/>{' '}          
              <strong>{t<string>('File Link: ')}</strong>
              <Input 
                label={fileLinkValue? params[2]=fileLinkValue: params[2]=''}
                type="text"
                value={fileLinkValue}
                onChange={(e) => {
                  setFileLinkValue(e.target.value);
                  setParams([...params]);
                }}
                ><input />
                <Label color={params[2]? 'blue': 'grey'}>
                        {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>            
            </>)}

            {messageIndex===14 && (<>
              <h2><strong>{t<string>('Group: ')}{hexToHuman(username)}</strong>{' '}</h2>
              <strong>{t<string>('Group Id: ')}</strong>{' '}
              {params[0] = messageId}
              <br /><br />
              <LabelHelp help={t<string>('Enter your Updated Group name.')}/>{' '}          
              <strong>{t<string>(' Group Name: ')}</strong>
              <Input 
                label={messageValue? params[1]=messageValue: params[1]=''}
                type="text"
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>

              <br /><br />
              <LabelHelp help={t<string>('Select Yes/No to Make this Group Private/Public.')}/> {' '}         
              <strong>{t<string>('Make Group Private (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t<string>(boolToString(params[2] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[2] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
              <br /><br />
              <LabelHelp help={t<string>('Enter the Group description.')}/>{' '}          
              <strong>{t<string>('Group Description: ')}</strong>
              <Input 
                label={fileLinkValue? params[3]=fileLinkValue: params[3]=''}
                type="text"
                value={fileLinkValue}
                onChange={(e) => {
                  setFileLinkValue(e.target.value);
                  setParams([...params]);
                }}
                ><input />
                <Label color={params[3]? 'blue': 'grey'}>
                        {params[3]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>            
              <br /><br />            
            </>)}

            {messageIndex===13 && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the Group to Leave.')}/>{' '}          
              <strong>{t<string>('Leave Group: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Group Id for the Group to Leave.')}/>{' '}          
              <strong>{t<string>('Group Id: ')}</strong>{' '}
              {params[0] = messageId}
              </h2>       
            </>)}


            {messageIndex===11 && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the Group to Delete your Messages from.')}/>{' '}          
              <strong>{t<string>('Delete Messages to: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Group Id for the Group to Delete your messages from.')}/>{' '}          
              <strong>{t<string>('Group Id: ')}</strong>{' '}
              {params[0] = messageId}
              </h2>       
            </>)}

            {messageIndex===10 && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the Group to Join.')}/>{' '}          
              <strong>{t<string>('Join Group: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Group Id for the Group to Join.')}/>{' '}          
              <strong>{t<string>('Group Id: ')}</strong>{' '}
              {params[0] = messageId}
              </h2>       
            </>)}

            {messageIndex===7 && (<>
              <h2>
              <LabelHelp help={t<string>('Delete this message.')}/>{' '}          
              <strong>{t<string>('Delete Message: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Message Id for the Message to Delete.')}/>{' '}          
              <strong>{t<string>('Message Id: ')}</strong>{' '}
              {params[0] = messageId}
              </h2>       
            </>)}

            {messageIndex===2 && (<>
              <h2>
              <LabelHelp help={t<string>('Name of the Group to Send a Message.')}/>{' '}          
              <strong>{t<string>('Send Message To: ')}{hexToHuman(username)}</strong></h2>
              <br />
              <LabelHelp help={t<string>('This is the Group Id for the Group to Send a Message.')}/>{' '}          
              <strong>{t<string>('Group Id: ')}</strong>{' '}
              {messageId? params[0] = messageId: params[0] = toAcct}
              <br /><br />
              <LabelHelp help={t<string>('Enter your message here..')}/>{' '}          
              <strong>{t<string>('Message: ')}</strong>
              <Input 
                label={messageValue? params[1]=messageValue: params[1]=''}
                type="text"
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a link to a file.')}/>{' '}          
              <strong>{t<string>('File Link: ')}</strong>
              <Input 
                label={fileLinkValue? params[2]=fileLinkValue: params[2]=''}
                type="text"
                value={fileLinkValue}
                onChange={(e) => {
                  setFileLinkValue(e.target.value);
                  setParams([...params]);
                }}
                ><input />
                <Label color={params[2]? 'blue': 'grey'}>
                        {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>            
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
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>

          <LabelHelp help={t<string>('Enter a link to a file.')}/>{' '}          
          <strong>{t<string>('File Link: ')}</strong>
          <Input 
            label={fileLinkValue? params[2]=fileLinkValue: params[2]=''}
            type="text"
            value={fileLinkValue}
            onChange={(e) => {
              setFileLinkValue(e.target.value);
              setParams([...params]);
            }}
            ><input />
            <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
          </Input>            
            </>)}      
        </>
        )}

        {message.isPayable && (
          <InputBalance
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