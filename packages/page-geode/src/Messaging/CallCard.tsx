// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx
import { Input, Label } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from '../shared/types';
//import { blake2AsHex } from '@polkadot/util-crypto';
//import MessageSignature from '../shared/MessageSignature';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Expander, LabelHelp, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';
//import { Table } from 'semantic-ui-react'

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';
//import Details from './Details';
import AllowedDetails from './AllowedDetails';
import SettingsDetails from './SettingsDetails';
//import SearchDetails from './SearchDetails';

import { getCallMessageOptions } from '../shared/util';
import InBoxDetails from './InBoxDetails';
import MyListsDetails from './MyListsDetails';
import FindListsDetails from './FindListsDetails';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallCard ({ className = '', contract, messageIndex, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
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
  
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const [isCalled, toggleIsCalled] = useToggle(false);
  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';

  const [_username, setUsername] = useState<string>('');
  const [_myInterest, setMyInterest] = useState<string>('');
  const [_feeBalance, setFeeBalance] = useState<string>('');
  const [_isHide, toggleIsHide] = useToggle(false);

  const isTest: boolean = false;
  //const isTestData: boolean = false; //takes out code elements we only see for test

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
      {toggleIsCalled()}
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

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) =>
      () => setOutcomes([...outcomes.filter((_, index) => index !== outcomeIndex)]),
    [outcomes]
  );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));      
  const isClosed = (isCalled && (messageIndex === 26 || messageIndex === 27 || 
                                 messageIndex===28 || messageIndex===33 ||
                                 messageIndex===36 || messageIndex===38));
                               
  return (
    <Card >
        <h2>
        <Badge icon='info' color={'blue'} />   
        <strong>{t<string>(' Geode Private Messaging ')}{' '}</strong>
        </h2>
        <Expander 
            className='viewInfo'
            isOpen={false}
            summary={<strong>{t<string>('Instructions: ')}</strong>}>
              {messageIndex===33 && (<>
                <h2><strong>{t<string>('Private Messaging - My Lists')}</strong></h2><br />
                <strong>{t<string>('Instructions for Managing Your Lists: ')}</strong><br />
                {'(1) '}{t<string>('Select the Account to Use then Click View')}<br /> 
                {'(2) '}{t<string>('You can create New Lists or Delete existing Lists.')}<br />
                <br />
                {t<string>('⚠️ Please Note: To view your Lists got to your inbox.')}
              </>)}

              {messageIndex===16 && (<>
                <strong>{t<string>('Instructions for Making a List: ')}</strong><br />
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br />
                {'(2) '}{t<string>('Create an @List Name for this New List.')}<br /> 
                {'(3) '}{t<string>('Select Private (Yes) or Public (No). ')}<br /> 
                {'(4) '}{t<string>('Add a List description. ')}            
                <br /><br />
                {t<string>('⚠️ Please Note: Click Submit to execute this transaction. ')}
              </>)}
        </Expander>
        <br />
        {isTest && (
          <InputAddress
          //help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t<string>('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}

        {!isClosed && (<>
          <InputAddress
          defaultValue={accountId}
          //help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t<string>('account to use')}
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
        </>)}

        {messageIndex !== null && (
          <>
            {isTest && (
            <>
            <Dropdown
              defaultValue={messageIndex}
              //help={t<string>('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={message === null}
              label={t<string>('Profile Item')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
            {messageIndex!=0 && messageIndex!=16 && !isClosed && (<>
              <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }              
              registry={contract.abi.registry}
            />
            </>)}

            {messageIndex===0 && (<>
              <LabelHelp help={t<string>('Enter your user name.')}/>{' '}          
              <strong>{t<string>('User Name: ')}</strong>
              <Input 
                  label={_username.length>0? params[0]=_username: params[0]=''}
                  type="text"
                  //defaultValue={hextoString(paramToNum(displayName))}
                  value={_username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
              </Input>

              <LabelHelp help={t<string>('Enter your interest words seperated by a comma.')}/>{' '}          
              <strong>{t<string>('Interest Words: ')}</strong>
              <Input 
                  label={_myInterest.length>0? params[1]=_myInterest: params[1]=''}
                  type="text"
                  //defaultValue={hextoString(paramToNum(displayName))}
                  value={_myInterest}
                  onChange={(e) => {
                    setMyInterest(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
              </Input>
            
              <LabelHelp help={t<string>('Enter your Fee Balance.')}/>{' '}          
              <strong>{t<string>('Fee Balance: ')}</strong>
              <Input 
                  label={_feeBalance.length>0? params[2]=_feeBalance: params[2]=''}
                  type="text"
                  //defaultValue={hextoString(paramToNum(displayName))}
                  value={_feeBalance}
                  onChange={(e) => {
                    setFeeBalance(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
              </Input>

              <br /><br />
              <LabelHelp help={t<string>('Select Yes/No to Hide Your Account.')}/> {' '}         
              <strong>{t<string>('Hide Your Account: ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t<string>(boolToString(params[3] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[3] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
            
            </>)}

            {messageIndex===16 && (<>
              <LabelHelp help={t<string>('Enter your New List name.')}/>{' '}          
              <strong>{t<string>('New List Name: ')}</strong>
              <Input 
                  label={_username.length>0? params[0]=_username: params[0]=''}
                  type="text"
                  //defaultValue={hextoString(paramToNum(displayName))}
                  value={_username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
              </Input>

              <br /><br />
              <LabelHelp help={t<string>('Select Yes/No to Make this Private/Public.')}/> {' '}         
              <strong>{t<string>('Make List Private (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t<string>(boolToString(params[1] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[1] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
              <br /><br />
              <LabelHelp help={t<string>('Enter the List description.')}/>{' '}          
              <strong>{t<string>('List Description: ')}</strong>
              <Input 
                  label={_myInterest.length>0? params[2]=_myInterest: params[2]=''}
                  type="text"
                  //defaultValue={hextoString(paramToNum(displayName))}
                  value={_myInterest}
                  onChange={(e) => {
                    setMyInterest(e.target.value);
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
        {isTest && (
        <>
        <Badge color='green' icon='hand'/>
          {t<string>('Gas Required - Information Only')}
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
        {message.isMutating && (
          <Toggle
            className='rpc-toggle'
            label={t<string>('read contract only, no execution')}
            onChange={toggleViaCall}
            value={isViaCall}
          />
        )}        
        </>
        )}

{!isClosed && (
        <>
        <Card>
        {isViaRpc
          ? ( <>
              <Button
              icon='sign-in-alt'
              isDisabled={!isValid}
              label={t<string>('View')}
              onClick={_onSubmitRpc} 
              />
              </>
            ) : (
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t<string>('Submit')}
              onStart={onClose}
            />
          )
        }      
        </Card>    
        </>
        )}

        {outcomes.length > 0 && messageIndex===38 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <SettingsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===36 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <FindListsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}


        {outcomes.length > 0 && messageIndex===33 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <MyListsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===26 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <InBoxDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                //isAccount={messageIndex > 1 ? true: false}
                outcome={outcome}
              />
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===28 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <AllowedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                //isAccount={messageIndex > 1 ? true: false}
                outcome={outcome}
              />
            ))}
            </div>
        )}
      
        </Card>
  );
}

export default React.memo(styled(CallCard)`
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


