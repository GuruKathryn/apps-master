// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx
import { Label, Container, Input } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
//import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
//import type { CallResult } from '../shared/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Card, LabelHelp, Expander, Badge, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';

import { getCallMessageOptions } from '../shared/util';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  //onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose?: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallSubCard ({ className = '', contract, messageIndex, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];
  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [payInValue, setPayInValue] = useState<string>();
  const [firstInValue, setFirstInValue] = useState<string>();
  const [secondInValue, setSecondInValue] = useState<string>();
//  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isViaCall, toggleViaCall] = useToggle();
  const [isOwnerApproved, toggleOwnerApproved] = useToggle();
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
  //const numToBN = (_num: number) => _num? _num * 1000000000000: 0;
  //const strToBN = (_str: string) => _str? new BN(_str): null;
  //const [isCalled, toggleIsCalled] = useToggle(false);
  //const isCalled: boolean = false; 
  const isTest: boolean = false;
  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isClosed: boolean = false; 
  
  
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

  function GeodeToZeo(_string: string): string {
    const _num = +_string * 1000000000000;
    return(_num.toString())
  }

  return (
    <StyledDiv className={className}>
      <Container >
        <br />
        <h2>
        <Badge icon='info' color={'blue'} /> 
        <strong>{t<string>(' Geode Create a New Program ')}</strong>
        </h2>
        <Expander 
            className='viewInfo'
            isOpen={false}
            summary={<strong>{t<string>('Instructions: ')}</strong>}>
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
        </Expander>
        {isTest && (
          <InputAddress
          isDisabled
          label={t<string>('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}
        <><br /><br />
        </>
        {!isClosed && (
        <>
        <InputAddress
          defaultValue={accountId}
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
        </>
        )}  
      
        {messageIndex !== null && (
          <>
            {isTest && (
            <>
            <Dropdown
              defaultValue={messageIndex}
              isError={message === null}
              label={t<string>('Profile Item')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
            
            {isTest && !isClosed && (<>
              <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }              
              registry={contract.abi.registry}
            />  
            {JSON.stringify(message.args)}          
            </>)}
          {!isTest && (<>
          
          <LabelHelp help={t<string>('Enter the Program Title.')}/>{' '}          
          <strong>{t<string>('Program Title: ')}</strong>
          <Input label='Program Title' 
            type="text"
            //defaultValue={hextoHuman(paramToString(title))}
            value={params[0]}
            onChange={(e) => {
              params[0] = e.target.value;
              setParams([...params]);
            }}
            ><input />
            <Label color={params[0]? 'blue': 'orange'}>
                    {params[0]? <>{'OK'}</>:<>{'Enter Value'}</>}
            </Label>
          </Input>

          <LabelHelp help={t<string>('Enter the Program Description.')}/>{' '}          
          <strong>{t<string>('Program Description: ')}</strong>
          <Input label='Program Description' 
            type="text"
            //defaultValue={hextoHuman(paramToString(title))}
            value={params[1]}
            onChange={(e) => {
              params[1] = e.target.value;
              setParams([...params]);
            }}
            ><input />
            <Label color={params[1]? 'blue': 'orange'}>
                    {params[1]? <>{'OK'}</>:<>{'Enter Value'}</>}
            </Label>
          </Input>

          <LabelHelp help={t<string>('Enter a Link for More Information.')}/>{' '}          
          <strong>{t<string>('Link for More Information: ')}</strong>
          <Input label='Link to More Information' 
            type="text"
            //defaultValue={hextoHuman(paramToString(title))}
            value={params[2]}
            onChange={(e) => {
              params[2] = e.target.value;
              setParams([...params]);
            }}
            ><input />
            <Label color={params[2]? 'blue': 'orange'}>
                    {params[2]? <>{'OK'}</>:<>{'Enter Value'}</>}
            </Label>
          </Input>

          <LabelHelp help={t<string>('Enter a Link to a Photo.')}/>{' '}          
          <strong>{t<string>('Link for Photo: ')}</strong>
          <Input label='Link to Photo' 
            type="text"
            //defaultValue={hextoHuman(paramToString(title))}
            value={params[3]}
            onChange={(e) => {
              params[3] = e.target.value;
              setParams([...params]);
            }}
            ><input />
            <Label color={params[3]? 'blue': 'orange'}>
                    {params[3]? <>{'OK'}</>:<>{'Enter Value'}</>}
            </Label>
          </Input>

          <LabelHelp help={t<string>('Enter a the First Level Reward.')}/>{' '}          
          <strong>{t<string>('First Level Reward: ')}</strong>
          <Input label='First Reward' 
            type="text"
            //defaultValue={0}
            value={firstInValue}
            onChange={(e) => {
              setFirstInValue(e.target.value);
            }}
          ><input />
          <Label basic>{firstInValue? params[4] = GeodeToZeo(firstInValue):'0'}
          <br />{' zeolites'}</Label>
          </Input>

          <LabelHelp help={t<string>('Enter a the Second Level Reward.')}/>{' '}          
          <strong>{t<string>('Second Level Reward: ')}</strong>
          <Input label='Second Reward' 
            type="text"
            //defaultValue={0}
            value={secondInValue}
            onChange={(e) => {
              setSecondInValue(e.target.value);
            }}
          ><input />
          <Label basic>{secondInValue? params[5] = GeodeToZeo(secondInValue): '0'}
          <br />{' zeolites'}</Label>
          </Input>

          <LabelHelp help={t<string>('Enter the Maximum Number of Rewards.')}/>{' '}          
          <strong>{t<string>('Maximum Number of Rewards: ')}</strong>
          <Input label='Maximum Number of Rewards' 
            type="text"
            //defaultValue={hextoHuman(paramToString(title))}
            value={params[6]}
            onChange={(e) => {
              params[6] = e.target.value;
              setParams([...params]);
            }}
            ><input />
            <Label color={params[6]? 'blue': 'orange'}>
                    {params[6]? <>{'OK'}</>:<>{'Enter Value'}</>}
            </Label>
          </Input>

          <LabelHelp help={t<string>('Enter (True/False) if Owner Approval is Required.')}/>{' '}          
          <strong>{t<string>('Owner Approval Required (True/False): ')}</strong>
          <br /><br />
          <Toggle
            className='booleantoggle'
            label={<strong>{t<string>(boolToString(isOwnerApproved))}</strong>}
            onChange={() => {
              toggleOwnerApproved()
              params[7] = !isOwnerApproved;
              setParams([...params]);
            }}
            value={isOwnerApproved}
          />
          <br />

          <LabelHelp help={t<string>('Enter the Minimum amount of coin to give your referrals.')}/>{' '}          
          <strong>{t<string>('Pay In Minimum Amount: ')}</strong>
          
          <Input label='Pay In Value' 
            type="text"
            //defaultValue={0}
            value={payInValue}
            onChange={(e) => {
              setPayInValue(e.target.value);
            }}
          ><input />
          <Label basic>{payInValue? params[8] = GeodeToZeo(payInValue): '0'}
          <br />{'  zeolites'}</Label>
          </Input>
          </>)}
          <br /><br />
          <LabelHelp help={t<string>('Enter the Total Value of the Program.')}/>{' '}          
          <strong>{t<string>('Total Program Value: ')}</strong>
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
        {isTest && (
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
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t<string>('Submit')}
              onStart={onClose}
            />
            </Card>
            <br /><br />
        </>
        )}
      </Container>
      <br /><br />
    </StyledDiv>);
}

const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;

export default React.memo(CallSubCard);




