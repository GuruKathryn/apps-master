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
  const [titleValue, setTitleValue] = useState<string>('');
  const [priceValue, setPriceValue] = useState<string>('');
  const [brandValue, setBrandValue] = useState<string>('');
  const [categoryValue, setCategoryValue] = useState<string>('');
  const [descriptionValue, setDescriptionValue] = useState<string>('');
  const [inventoryValue, setInventoryValue] = useState<string>('');
  const [photo1Value, setPhoto1Value] = useState<string>('');
  const [photo2Value, setPhoto2Value] = useState<string>('');
  const [photo3Value, setPhoto3Value] = useState<string>('');
  const [moreInfoValue, setMoreInfoValue] = useState<string>('');
  const [deliveryInfoValue, setDeliveryInfoValue] = useState<string>('');
  const [locationValue, setLocationValue] = useState<string>('');

  const [_isHide, toggleIsHide] = useToggle(false);
  const [_isDelivered, toggleIsDelivered] = useToggle(false);

  const [isViaCall, toggleViaCall] = useToggle();

  const paramToString = (_string: string|undefined) => _string? _string : '';
  const hexToHuman =(_string: string|undefined) => isHex(_string)? hexToString(_string): '';
  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
  const geodeToZeo = (_string: string) => _string.length>0? (+_string * 1000000000000).toString(): '0';
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const refHeader: string[] = 
  ['Add an Item to Your Cart','Add a Product to a List','Add a Service to a List','Bookmark a Store','Remove Item from Cart.',
   'Update Item Quantity','Check out of Cart','Rate This Item','Rate the Seller','Report Problem Item Damaged',
   'Report Problem Wrong Item','Report Problem Item Not Received','Message Seller','Update Buyer Account','Remove a Product from a List',
   'Remove a Service from a List','Delete a Product List','Delete a Service List','','Update Tracking Information', 
   'Refuse an Order','Issue Refund','Issue Replacement','Deny Resolution Request','Message the Buyer', 
   'Rate a Buyer','','Update a Product Details','','Update a Service Details',
   '','','','','','','','','','Remove a Store Bookmark','spare'];
  // NOTE!:
  // for test set to true
  const isShow: boolean = false;

  function t_strong(_str: string): JSX.Element{return(<><strong>{t<string>(_str)}</strong></>)}

  function withHelp(_str: string, _help: string): JSX.Element {
    return(<>
    <LabelHelp help={t<string>(_help)} />
    {' '}{t<string>(_str)}
    </>)
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
        {messageIndex===0 && (<>
          <h2><strong>{t<string>('Market - Add an Item to Your Cart')}</strong></h2><br />
            <strong>{t<string>('Instructions for Adding an Item to Your Cart: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Enter the Quantity to Order.')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===1 && (<>
          <h2><strong>{t<string>('Market - Add a Product to a List')}</strong></h2><br />
            <strong>{t<string>('Instructions for Adding a Product to a List: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Enter the name of the List.')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===2 && (<>
          <h2><strong>{t<string>('Market - Add a Service to a List')}</strong></h2><br />
            <strong>{t<string>('Instructions for Adding a Service to a List: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Enter the name of the List.')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===3 && (<>
          <h2><strong>{t<string>('Market - Bookmark this Store')}</strong></h2><br />
            <strong>{t<string>('Instructions for bookmarking a store: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Select the Account of the Store')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===4 && (<>
          <h2><strong>{t<string>('Market - Remove Item from Cart')}</strong></h2><br />
            <strong>{t<string>('Instructions for Removing an Item from Cart: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===5 && (<>
          <h2><strong>{t<string>('Market - Update Item Quantity')}</strong></h2><br />
            <strong>{t<string>('Instructions for Updating an Item Quantity: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Enter the new quantity.')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===6 && (<>
          <h2><strong>{t<string>('Market - Cart Checkout')}</strong></h2><br />
            <strong>{t<string>('Instructions for Checking out of Cart: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter the Address of the Item Delivery.')}<br /> 
            {'(3) '}{t<string>('Select the Seller Account to be Paid.')}<br /> 
            {'(4) '}{t<string>('Enter the Total Amount to be Paid to the Seller.')}<br /> 
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===7 && (<>
          <h2><strong>{t<string>('Market - Rate this Item: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Rating an Item: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a Rating (1 to 5 Stars).')}<br /> 
            {'(3) '}{t<string>('Enter comments on the product or service.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===8 && (<>
          <h2><strong>{t<string>('Market - Rate this Seller: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Rating a Seller: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Select Account of Seller')}<br />
            {'(3) '}{t<string>('Enter a Rating (1 to 5 Stars).')}<br /> 
            {'(4) '}{t<string>('Enter comments on the product or service.')}<br /> 
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===9 && (<>
          <h2><strong>{t<string>('Market - Report Problem, Item Damaged: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Reporting a Damaged Item: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a photo or YouTube URL for the damaged item.')}<br /> 
            {'(3) '}{t<string>('Enter description of the problem.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===10 && (<>
          <h2><strong>{t<string>('Market - Report Problem, Wrong Item Received: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Reporting a Wrong Item Received: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a photo or YouTube URL for the wrong item.')}<br /> 
            {'(3) '}{t<string>('Enter description of the problem.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===11 && (<>
          <h2><strong>{t<string>('Market - Report Problem, Item Not Received: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Reporting a Item Not Received: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a photo or YouTube URL if applicable.')}<br /> 
            {'(3) '}{t<string>('Enter description of the problem.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===12 && (<>
          <h2><strong>{t<string>('Market - Send a Message to the Seller: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Sending a Message to the Seller: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a link to a Photo.')}<br />
            {'(3) '}{t<string>('Enter a Message to the Seller.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===13 && (<>
          <h2><strong>{t<string>('Market - Update Buyer Account: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Buyer Account: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a Buyer Name.')}<br />
            {'(3) '}{t<string>('Enter a Location.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===14 && (<>
          <h2><strong>{t<string>('Market - Remove an Item from a Product List: ')}</strong></h2><br />
            <strong>{t<string>('Instructions to remove an Item from a Product List: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===15 && (<>
          <h2><strong>{t<string>('Market - Remove an Item from a Service List: ')}</strong></h2><br />
            <strong>{t<string>('Instructions to remove an Item from a Service List: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===16 && (<>
          <h2><strong>{t<string>('Market - Delete Product List: ')}</strong></h2><br />
            <strong>{t<string>('Instructions to delete a Product List: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===17 && (<>
          <h2><strong>{t<string>('Market - Delete a Service List: ')}</strong></h2><br />
            <strong>{t<string>('Instructions to delete a Service List: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===19 && (<>
          <h2><strong>{t<string>('Market - Update Tracking Information: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Updating Tracking Information: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a Tracking Information.')}<br />
            {'(3) '}{t<string>('Click Shipped Yes/No.')}<br /> 
            {'(4) '}{t<string>('Click Delivered Yes/No.')}<br /> 
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===20 && (<>
          <h2><strong>{t<string>('Market - Refuse an Order: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Refusing an Item Order: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===21 && (<>
          <h2><strong>{t<string>('Market - Seller Issue a Refund: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Seller to Issue a Refund: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===22 && (<>
          <h2><strong>{t<string>('Market - Seller Issue a Replacement: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Seller to Issue a Replacement: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Update Tracking Information.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===23 && (<>
          <h2><strong>{t<string>('Market - Deny Resolution Request: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Seller to deny a resolution request: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===24 && (<>
          <h2><strong>{t<string>('Market - Message the Buyer: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Messaging the Buyer: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Enter a Photo or Youtube URL.')}<br /> 
            {'(3) '}{t<string>('Enter a message to the Buyer.')}<br /> 
            {'(4) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===25 && (<>
          <h2><strong>{t<string>('Market - Rate a Buyer: ')}</strong></h2><br />
            <strong>{t<string>('Instructions for Reviewing a Buyer: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account.')}<br /> 
            {'(2) '}{t<string>('Select the Account for the Buyer to Rate.')}<br /> 
            {'(3) '}{t<string>('Enter a Rating of (1 to 5) Stars.')}<br /> 
            {'(4) '}{t<string>('Enter a text rating or leave blank.')}<br /> 
            {'(5) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===27 && (<>
          <h2><strong>{t<string>('Market - Update a Product Details')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===29 && (<>
          <h2><strong>{t<string>('Market - Update a Service Details')}</strong></h2><br />
            <strong>{t<string>('Instructions: ')}</strong><br />
            {'(1) '}{t<string>('Select the Account to use (call from account)')}<br /> 
            {'(2) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
          </>)}
          {messageIndex===39 && (<>
          <h2>{t_strong('Market - Remove Store Bookmark')}</h2><br />
            <strong>{t<string>('Instructions for removing a bookmark to a store: ')}</strong><br />
            {'(1) '}{t<string>('Select the From Account')}<br /> 
            {'(2) '}{t<string>('Select the Account of the Store')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}
            <br /><br />
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

            {messageIndex===39 && (<>
              <h2><strong>{withHelp('Remove Store Bookmark: ', 'Remove a Bookmark store account.')}{hexToHuman(username)}</strong><br /><br /></h2>
              <strong>{withHelp('Store Account: ', 'Select the store Account.')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={messageId}
                label={t<string>('Store Account')}
                labelExtra={
                <Available
                    label={t<string>('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />
        </>)}                  

            {messageIndex===29 && <>
                <h2>
              <LabelHelp help={t<string>('Service to Update.')}/>{' '}          
                <strong>{t<string>('Update a Sevice: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Service Id: ')}</strong>{' '}
                {params[0] = messageId}<br />                  
              </h2>
              <br /><br />
              <LabelHelp help={t<string>('Enter your Updated Service Title.')}/>{' '}          
              <strong>{t<string>(' Service Title: ')}</strong>
              <Input 
                label={titleValue? params[1]=titleValue: params[1]=''}
                type="text"
                value={titleValue}
                onChange={(e) => {
                  setTitleValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the price of the service.')}/>{' '}          
              <strong>{t<string>(' Service Price: ')}</strong>
              <Input 
                label={priceValue? params[2]=geodeToZeo(priceValue): params[2]=''}
                type="text"
                value={priceValue}
                onChange={(e) => {
                  setPriceValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the category of the service.')}/>{' '}          
              <strong>{t<string>(' Service Catagory: ')}</strong>
              <Input 
                label={categoryValue? params[3]=categoryValue: params[3]=''}
                type="text"
                value={categoryValue}
                onChange={(e) => {
                  setCategoryValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[3]? 'blue': 'grey'}>
                    {params[3]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a the service description.')}/> {' '}         
              <strong>{t<string>(' Service Description: ')}</strong>
              <Input 
                label={descriptionValue? params[4]=descriptionValue: params[4]=''}
                type="text"
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[4]? 'blue': 'grey'}>
                    {params[4]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the number of services in inventory.')}/> {' '}         
              <strong>{t<string>(' Service Inventory: ')}</strong>
              <Input 
                label={inventoryValue? params[5]=inventoryValue: params[5]=''}
                type="text"
                value={inventoryValue}
                onChange={(e) => {
                  setInventoryValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[5]? 'blue': 'grey'}>
                    {params[5]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a photo or YouTube link.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube Link: ')}</strong>
              <Input 
                label={photo1Value? params[6]=photo1Value: params[6]=''}
                type="text"
                value={photo1Value}
                onChange={(e) => {
                  setPhoto1Value(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[6]? 'blue': 'grey'}>
                    {params[6]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a photo or YouTube link.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube Link: ')}</strong>
              <Input 
                label={photo2Value? params[7]=photo2Value: params[7]=''}
                type="text"
                value={photo2Value}
                onChange={(e) => {
                  setPhoto2Value(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[7]? 'blue': 'grey'}>
                    {params[7]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a photo or YouTube link.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube Link: ')}</strong>
              <Input 
                label={photo3Value? params[8]=photo3Value: params[8]=''}
                type="text"
                value={photo3Value}
                onChange={(e) => {
                  setPhoto3Value(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[8]? 'blue': 'grey'}>
                    {params[8]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a link for booking information.')}/> {' '}         
              <strong>{t<string>(' Booking Information Link: ')}</strong>
              <Input 
                label={moreInfoValue? params[9]=moreInfoValue: params[9]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[9]? 'blue': 'grey'}>
                    {params[9]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the service location.')}/> {' '}         
              <strong>{t<string>(' Service location: ')}</strong>
              <Input 
                label={locationValue? params[10]=locationValue: params[10]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[10]? 'blue': 'grey'}>
                    {params[10]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
            </>}

            {messageIndex===27 && <>
              <h2>
              <LabelHelp help={t<string>('Product to Update.')}/>{' '}          
                <strong>{t<string>('Update a Product: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Product Id: ')}</strong>{' '}
                {params[0] = messageId}<br />                  
              </h2>
              <br /><br />
              <LabelHelp help={t<string>('Enter your Updated Product Title.')}/>{' '}          
              <strong>{t<string>(' Product Title: ')}</strong>
              <Input 
                label={titleValue? params[1]=titleValue: params[1]=''}
                type="text"
                value={titleValue}
                onChange={(e) => {
                  setTitleValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the price of the product.')}/>{' '}          
              <strong>{t<string>(' Product Price: ')}</strong>
              <Input 
                label={priceValue? params[2]=geodeToZeo(priceValue): params[2]=''}
                type="text"
                value={priceValue}
                onChange={(e) => {
                  setPriceValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the brand of the product.')}/>{' '}          
              <strong>{t<string>(' Product Brand: ')}</strong>
              <Input 
                label={brandValue? params[3]=brandValue: params[3]=''}
                type="text"
                value={brandValue}
                onChange={(e) => {
                  setBrandValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[3]? 'blue': 'grey'}>
                    {params[3]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the category of the product.')}/>{' '}          
              <strong>{t<string>(' Product Catagory: ')}</strong>
              <Input 
                label={categoryValue? params[4]=categoryValue: params[4]=''}
                type="text"
                value={categoryValue}
                onChange={(e) => {
                  setCategoryValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[4]? 'blue': 'grey'}>
                    {params[4]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a the product description.')}/> {' '}         
              <strong>{t<string>(' Product Description: ')}</strong>
              <Input 
                label={descriptionValue? params[5]=descriptionValue: params[5]=''}
                type="text"
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[5]? 'blue': 'grey'}>
                    {params[5]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the number of products in inventory.')}/> {' '}         
              <strong>{t<string>(' Product Inventory: ')}</strong>
              <Input 
                label={inventoryValue? params[6]=inventoryValue: params[6]=''}
                type="text"
                value={inventoryValue}
                onChange={(e) => {
                  setInventoryValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[6]? 'blue': 'grey'}>
                    {params[6]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a photo or YouTube link.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube Link: ')}</strong>
              <Input 
                label={photo1Value? params[7]=photo1Value: params[7]=''}
                type="text"
                value={photo1Value}
                onChange={(e) => {
                  setPhoto1Value(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[7]? 'blue': 'grey'}>
                    {params[7]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a photo or YouTube link.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube Link: ')}</strong>
              <Input 
                label={photo2Value? params[8]=photo2Value: params[8]=''}
                type="text"
                value={photo2Value}
                onChange={(e) => {
                  setPhoto2Value(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[8]? 'blue': 'grey'}>
                    {params[8]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a photo or YouTube link.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube Link: ')}</strong>
              <Input 
                label={photo3Value? params[9]=photo3Value: params[9]=''}
                type="text"
                value={photo3Value}
                onChange={(e) => {
                  setPhoto3Value(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[9]? 'blue': 'grey'}>
                    {params[9]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a link to further product information.')}/> {' '}         
              <strong>{t<string>(' Link to further product information: ')}</strong>
              <Input 
                label={moreInfoValue? params[10]=moreInfoValue: params[10]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[10]? 'blue': 'grey'}>
                    {params[10]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the product delivery information if applicable.')}/> {' '}         
              <strong>{t<string>(' Product delivery information: ')}</strong>
              <Input 
                label={deliveryInfoValue? params[11]=deliveryInfoValue: params[11]=''}
                type="text"
                value={deliveryInfoValue}
                onChange={(e) => {
                  setDeliveryInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[11]? 'blue': 'grey'}>
                    {params[11]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter the location of the product if applicable.')}/> {' '}         
              <strong>{t<string>(' Product location: ')}</strong>
              <Input 
                label={locationValue? params[12]=locationValue: params[12]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[12]? 'blue': 'grey'}>
                    {params[12]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Select Yes/No to Make this product Digital.')}/> {' '}         
              <strong>{t<string>('Product Digital (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t<string>(boolToString(params[13] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[13] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
            </>}

            {messageIndex===25 && (<>
              <h2>
              <LabelHelp help={t<string>('Rate a Buyer.')}/>{' '}          
                <strong>{t<string>('Rate a Buyer: ')}{hexToHuman(username)}</strong><br /><br />
                <LabelHelp help={t<string>('Account of the Buyer.')}/>{' '}
                <strong>{t<string>('Buyer Account: ')}</strong>{messageId}<br />
                <br />                  
              </h2>
              <LabelHelp help={t<string>('Select Buyer Account to Rate.')}/>{' '}          
              <strong>{t<string>('Buyer Account to Rate: ')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={paramToString(toAcct)}
                label={t<string>('Buyer Account to Rate')}
                labelExtra={
                <Available
                    label={t<string>('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />
              <LabelHelp help={t<string>('Enter a Buyer Review Rating 1-5 Stars.')}/> {' '}         
              <strong>{t<string>(' Buyer Rating 1-5 Stars: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <br />
              <LabelHelp help={t<string>('Enter a Review.')}/> {' '}         
              <strong>{t<string>(' Enter a Review: ')}</strong>
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[1]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <br />
            </>)}       
            {messageIndex===24 && (<>
              <h2>
              <LabelHelp help={t<string>('Send a message to the Buyer.')}/>{' '}          
                <strong>{t<string>('Send Message for this Item: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>
              <LabelHelp help={t<string>('Enter a photo or YouTube URL.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube URL: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <br />
              <LabelHelp help={t<string>('Enter message.')}/> {' '}         
              <strong>{t<string>(' Message: ')}</strong>
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>


            </>)}       
            {messageIndex===23 && (<>
              <h2>
              <LabelHelp help={t<string>('Seller to deny a resolution request.')}/>{' '}          
                <strong>{t<string>('Item to Deny Resolution Request: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>
            </>)}       

            {messageIndex===22 && (<>
              <h2>
              <LabelHelp help={t<string>('Seller Issue a Replacement.')}/>{' '}          
                <strong>{t<string>('Item to Issue a Replacement: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>
              <LabelHelp help={t<string>('Enter a new Tracking Update.')}/> {' '}         
              <strong>{t<string>(' Tracking Update: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <br />
            </>)}       

            {messageIndex===21 && (<>
              <h2>
              <LabelHelp help={t<string>('Seller Issue a Refund.')}/>{' '}          
                <strong>{t<string>('Item to Issue a Refund: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>
            </>)}       

            {messageIndex===20 && (<>
              <h2>
              <LabelHelp help={t<string>('Refuse an Order.')}/>{' '}          
                <strong>{t<string>('Item to Refuse Order: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>
            </>)}       

            {messageIndex===19 && (<>
              <h2>
              <LabelHelp help={t<string>('Update Tracking Information.')}/>{' '}          
                <strong>{t<string>('Update Tracking Information: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>

              <LabelHelp help={t<string>('Enter a new Tracking Update.')}/> {' '}         
              <strong>{t<string>(' Tracking Update: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <br />
              <LabelHelp help={t<string>('Select Yes/No if this product has shipped.')}/> {' '}         
              <strong>{t<string>('Product Shipped (Yes/No): ')}</strong>
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
              <br />
              <LabelHelp help={t<string>('Select Yes/No if this product has been delivered.')}/> {' '}         
              <strong>{t<string>('Product Delivered (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle2'
                label={<strong>{t<string>(boolToString(params[3] = _isDelivered))}</strong>}
                onChange={() => {
                  toggleIsDelivered()
                  params[3] = !_isDelivered;
                  setParams([...params]);
                }}
                value={_isDelivered}
              />
      </>)}       

      {(messageIndex===17 || messageIndex===16) && (<>
              <h2>
                <strong>{withHelp('Delete List: ', 'Remove List.')}</strong><br /><br />
                <strong>{t<string>('List ID: ')}</strong>{params[0]=messageId}<br /><br />
                <strong>{t<string>('List Name: ')}</strong>{hexToHuman(username)}<br />
                <br />                  
              </h2>
      </>)}       

      {messageIndex===14 && (<>
              <h2>
                <strong>{withHelp('Remove Product from Your List: ', 'Remove Product from Your List.')}</strong><br /><br />
                <strong>{t<string>('Product ID: ')}</strong>{params[0]=messageId}<br /><br />
                <strong>{t<string>('List ID: ')}</strong>{params[1]=username}<br /><br />
                <br />                  
              </h2>
      </>)}       

      {messageIndex===15 && (<>
              <h2>
                <strong>{withHelp('Remove Service Item from Your List: ', 'Remove Item from Your List.')}</strong><br /><br />
                <strong>{t<string>('Service ID: ')}</strong>{params[0]=messageId}<br /><br />
                <strong>{t<string>('List ID: ')}</strong>{params[1]=username}<br /><br />
                <br />                  
              </h2>
      </>)}       

            {messageIndex===13 && (<>
              <h2>
              <LabelHelp help={t<string>('Update Buyer Account.')}/>{' '}          
                <strong>{t<string>('Update Buyer Account: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Account ID: ')}</strong>{messageId}<br />
                <br />                  
              </h2>

              <LabelHelp help={t<string>('Enter a new Buyer Name.')}/> {' '}         
              <strong>{t<string>(' Buyer Name: ')}</strong>
              <Input 
                label={locationValue? params[0]=locationValue: params[0]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter your Location.')}/> {' '}         
              <strong>{t<string>(' Location: ')}</strong>
              <Input 
                label={moreInfoValue? params[1]=moreInfoValue: params[1]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
      </>)}       

            {messageIndex===12 && (<>
              <h2>
              <LabelHelp help={t<string>('Message the Seller.')}/>{' '}          
                <strong>{t<string>('Send a Message for Item: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Item Id: ')}</strong>{' '}
                {params[0] = messageId}<br />                  
              </h2>

              <LabelHelp help={t<string>('Enter a Photo Link.')}/> {' '}         
              <strong>{t<string>(' Photo Link: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a message.')}/> {' '}         
              <strong>{t<string>(' Message: ')}</strong>
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
      </>)}       

      {(messageIndex===9 || messageIndex===10 || messageIndex===11) && (<>
              <h2>
              <LabelHelp help={t<string>('Report a Problem.')}/>{' '}          
                <strong>{t<string>('Item Name: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
              </h2>
              <LabelHelp help={t<string>('Enter a Photo or YouTube URL.')}/> {' '}         
              <strong>{t<string>(' Photo or YouTube URL: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a comment about the problem.')}/> {' '}         
              <strong>{t<string>(' Problem Comment: ')}</strong>
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>

            </>)}       

            {messageIndex===8 && (<>
              <LabelHelp help={t<string>('Select the Sellers Account.')}/>{' '}          
              <strong>{t<string>('Seller Account: ')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={paramToString(toAcct)}
                label={t<string>('Seller Account')}
                labelExtra={
                <Available
                    label={t<string>('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />
              <LabelHelp help={t<string>('Enter a Item Rating (1 to 5 Stars).')}/> {' '}         
              <strong>{t<string>(' Seller Rating (1 to 5 Stars): ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a comment.')}/> {' '}         
              <strong>{t<string>(' Comment: ')}</strong>
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
      </>)}       


            {messageIndex===7 && (<>
              <h2>
              <LabelHelp help={t<string>('Item Rating.')}/>{' '}          
                <strong>{t<string>('Rate a Product or Service: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t<string>('Item Id: ')}</strong>{' '}
                {params[0] = messageId}<br />                  
              </h2>

              <LabelHelp help={t<string>('Enter a Item Rating (1 to 5 Stars).')}/> {' '}         
              <strong>{t<string>(' Product or Service Rating (1 to 5 Stars): ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t<string>('Enter a comment.')}/> {' '}         
              <strong>{t<string>(' Comment: ')}</strong>
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
      </>)}       


      {messageIndex===6 && (<>
              <LabelHelp help={t<string>('Enter the delivery address of the Items in your Cart.')}/> {' '}         
              <strong>{t<string>(' Delivery Address: ')}</strong>
              <Input 
                label={locationValue? params[0]=locationValue: params[0]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{t<string>('OK')}</>:<>{t<string>('Enter Value')}</>}</Label>
              </Input>
             
              <LabelHelp help={t<string>('Enter the Total Price Amount of Items in Your Cart.')}/> {' '}         
              <strong>{t<string>(' Total Amount in Cart: ')}</strong>
      </>)}       

      {messageIndex===5 && (<>
          <h2>
              <LabelHelp help={t<string>('Update Item Quantity.')}/>{' '}          
              <strong>{t<string>('Item Name: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Item Id.')}/>{' '}          
              <strong>{t<string>('Item Id: ')}</strong>{' '}
              {params[0] = messageId}
          </h2>
          <h2>
          <LabelHelp help={t<string>('Enter a the number of items to Order.')}/>{' '}          
          <strong>{t<string>('Quantity: ')}</strong></h2>
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
        </>)}                  

        {messageIndex===4 && (<>
          <h2>
              <LabelHelp help={t<string>('Remove Item from Cart.')}/>{' '}          
              <strong>{t<string>('Item Name: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Item Id.')}/>{' '}          
              <strong>{t<string>('Item Id: ')}</strong>{' '}
              {params[0] = messageId}
          </h2>
        </>)}                  

        {messageIndex===3 && (<>
          <h2>
              <strong>{withHelp('Bookmark Store: ', 'Bookmark a store account.')}{hexToHuman(username)}</strong><br /><br />
          </h2>
              <strong>{withHelp('Store Account: ', 'Select the store Account.')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={messageId}
                label={t<string>('Store Account')}
                labelExtra={
                <Available
                    label={t<string>('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />
        </>)}                  

        {messageIndex===2 && (<>
          <h2>
              <LabelHelp help={t<string>('Add a Service to a List.')}/>{' '}          
              <strong>{t<string>('Service Name: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Product Id.')}/>{' '}          
              <strong>{t<string>('Service Id: ')}</strong>{' '}
              {params[0] = messageId}
          </h2>
          <h2>
          <LabelHelp help={t<string>('Enter a the name of the List.')}/>{' '}          
          <strong>{t<string>('List Name: ')}</strong></h2>
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
        </>)}                  

        {messageIndex===1 && (<>
          <h2>
              <LabelHelp help={t<string>('Add a Product to a List.')}/>{' '}          
              <strong>{t<string>('Product Name: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Product Id.')}/>{' '}          
              <strong>{t<string>('Product Id: ')}</strong>{' '}
              {params[0] = messageId}
          </h2>
          <h2>
          <LabelHelp help={t<string>('Enter a the name of the List.')}/>{' '}          
          <strong>{t<string>('List Name: ')}</strong></h2>
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
        </>)}                  

      {messageIndex===0 && (<>
          <h2>
              <LabelHelp help={t<string>('Add Item to Your Cart.')}/>{' '}          
              <strong>{t<string>('Item Name: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t<string>('This is the Item Id.')}/>{' '}          
              <strong>{t<string>('Item Id: ')}</strong>{' '}
              {params[0] = messageId}
          </h2>
          <h2>
          <LabelHelp help={t<string>('Enter a the number of items to Order.')}/>{' '}          
          <strong>{t<string>('Quantity: ')}</strong></h2>
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