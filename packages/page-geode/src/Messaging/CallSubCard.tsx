// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx
import { Container } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Badge, Card, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
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
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isViaCall, toggleViaCall] = useToggle();
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  //const [isCalled, toggleIsCalled] = useToggle(false);
  const isCalled = false;
  // todo - remove isCalled

  const isTest: boolean = false;
  
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
  const isClosed = (isCalled && (messageIndex === 9 || messageIndex === 14 || messageIndex===10 || messageIndex===11 || messageIndex===13));

  return (
    <StyledDiv className={className}>
      <Card>
      <Container >
        <br />
        <h2>
         

        {messageIndex===3 && (<>
                <h2>
                <Badge icon='info' color={'blue'} />
                <strong>{t<string>('Add Accounts to Your Inbox')}</strong></h2>
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t<string>('Select the Account to Add.')}<br />
                {'(3) '}{t<string>('Click Submit.')}<br />
              </>)}
        {messageIndex===4 && (<>
                <h2>
                <Badge icon='info' color={'blue'} />  
                <strong>{t<string>('Remove Accounts from Your Inbox')}</strong></h2>
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t<string>('Select the Account to Remove.')}<br />
                {'(3) '}{t<string>('Click Submit.')}<br />
              </>)}
        {messageIndex===5 && (<>
                <h2>
                <Badge icon='info' color={'blue'} />
                <strong>{t<string>('Block Accounts from Your Inbox')}</strong></h2>
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t<string>('Select the Account to Block.')}<br />
                {'(3) '}{t<string>('Click Submit.')}<br />
              </>)}
        {messageIndex===6 && (<>
                <h2>
                <Badge icon='info' color={'blue'} />
                <strong>{t<string>('Unblock Accounts from Your Inbox')}</strong></h2>
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t<string>('Select the Account to Unblock.')}<br />
                {'(3) '}{t<string>('Click Submit.')}<br />
              </>)}
        {messageIndex===8 && (<>
                <h2>
                <Badge icon='info' color={'blue'} />
                <strong>{t<string>('Delete All Messages to another User')}</strong></h2>
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t<string>('Select the Account you wish to delete messages.')}<br />
                {'(3) '}{t<string>('Click Submit.')}<br />
              </>)}
        {messageIndex==22 && (<>
                <h2>
                <Badge icon='info' color={'blue'} />
                <strong>{t<string>('Make a Paid List')}</strong></h2>
                {'(1) '}{t<string>('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t<string>('Enter the List Name.')}<br />
                {'(3) '}{t<string>('Enter the List Description.')}<br />
                {'(4) '}{t<string>('Add / Remove Accounts to the List.')}<br />
                {'(5) '}{t<string>('Click Submit.')}<br />
              </>)}

        </h2>
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
            
            {!isClosed && (<>   
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
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t<string>('Submit')}
              onStart={onClose}
            />
            <br /><br />
        </>
        )}
      </Container>
      <br /><br />
      </Card>
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




