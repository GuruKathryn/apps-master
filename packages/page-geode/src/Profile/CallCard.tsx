// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from './types';
import { blake2AsHex } from '@polkadot/util-crypto';
import MessageSignature from '../shared/MessageSignature';


//import type { Hash } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Static, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { stringToHex, BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';
//import OutcomeClaim from './OutcomeClaim';
import Details from './Details';
//import ClaimIds from './ClaimIds';
import { getCallMessageOptions } from './util';
//import Endorsements from './Endorsements';
//import HideClaims from './HideClaims';

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
  const [isMenu, setIsMenu] = useState(false);
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const [isTest, setIsTest] = useToggle();
  //const [isClaimIds, setIsClaimIds] = useToggle();
  
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
      {setIsMenu(true)}
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

  return (
    <Card >
        <strong>{t<string>(' Geode Profile ')}{' '}{messageIndex}</strong>
        {isTest && (
          <InputAddress
          //help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t<string>('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}
        {messageIndex !== null && messageIndex<2 && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t<string>('Select the AccountID for this Profile:')}
          </>)}
          {messageIndex !== null && messageIndex===2 && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t<string>('Select which of your Accounts is asking for this Profile:')}
          </>)}
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
            {messageIndex !== null && messageIndex===3 && (
              <>
              <Badge color='blue' icon='2'/>
              {t<string>('Select the Account whose Profile you want to view:')}
              </>)}

            {messageIndex<5 && (
              <>
                <Badge color='blue' icon='2'/>
                {t<string>('Enter Your keywords, description and link to See More:')}
              </>)}
            <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }              
              registry={contract.abi.registry}
            />
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
        {outcomes.length > 0 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <Details
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                isAccount={messageIndex===10 ? true: false}
                outcome={outcome}
              />
            ))}
            </div>
        )}

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
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t('Submit')}
              onStart={onClose}
            />
          )
        }
        {isMenu && (
          <>
        {' | '}
            <Button
              icon={(isTest) ? 'minus' : 'plus'}
              //isDisabled={!isValid}
              label={t<string>('Developer')}
              onClick={setIsTest} 
            />
          </>
        )}
        {isTest && (
        <div>
        <br /><br />
        <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }            
              registry={contract.abi.registry}
        />
        <Static
          label={t<string>('preimage hash')}
          value={blake2AsHex(stringToHex(params.toString()))}
          withCopy
        />
        <strong>{t<string>('Message Signature:')}</strong><br />
          <MessageSignature
            message={message}
            params={params}
          />
        <strong>{' accountId: '}</strong>{accountId}<br /><br />
        <strong>{' Contract: '}</strong><br />
        <strong>{' contract abi length: '}</strong>{JSON.stringify(contract.abi).length}<br />
        <strong>{' contract address: '}</strong>{JSON.stringify(contract.address)}<br />
        <strong>{' contract api length: '}</strong>{JSON.stringify(contract.api).length}<br />
        <strong>{' contract query: '}</strong>{JSON.stringify(contract.query)}<br />
        <strong>{' contract registry: '}</strong>{JSON.stringify(contract.registry)}<br />
        <strong>{' contract tx: '}</strong>{JSON.stringify(contract.tx)}<br />
        <br />
        <strong>{' Params: '}</strong><br />
        <strong>{' (params) hash: '}</strong>{JSON.stringify(params)}<br />
        <strong>{' (params) dbParams: '}</strong>{JSON.stringify(dbParams)}<br />
        <strong>{' dbValues: '}</strong>{JSON.stringify(dbValue)}<br /><br />

        <strong>{' Messages:'}</strong><br />
        <strong>{' messageIndex: '}{messageIndex}</strong><br />
        <strong>{' message.args: '}</strong>{JSON.stringify(message.args)}<br />
        <strong>{' message.identifier: '}</strong>{JSON.stringify(message.identifier)}<br />
        <strong>{' message.docs: '}</strong>{JSON.stringify(message.docs)}<br />
        <strong>{' message.index: '}</strong>{JSON.stringify(message.index)}<br />
        <strong>{' message.isMutating: '}</strong>{JSON.stringify(message.isMutating)}<br />
        <strong>{' message.fromU8a: '}</strong>{JSON.stringify(message.fromU8a)}<br />
        <strong>{' message.isConstructor: '}</strong>{JSON.stringify(message.isConstructor)}<br />
        <strong>{' message.isPayable: '}</strong>{JSON.stringify(message.isPayable)}<br />
        <strong>{' message.method: '}</strong>{JSON.stringify(message.method)}<br />
        <strong>{' message.path: '}</strong>{JSON.stringify(message.path)}<br />
        <strong>{' message.returnType: '}</strong>{JSON.stringify(message.returnType)}<br />
        <strong>{' message.selector: '}</strong>{JSON.stringify(message.selector)}<br /><br />
        
        <strong>{' outcomes: '}</strong>{JSON.stringify(outcomes)}<br /><br />
        
        <strong>{' registry: '}</strong>{JSON.stringify(contract.abi.registry)}<br /><br />

        <strong>{' Weights: '}</strong>
        <strong>{' estimatedWeight: '}</strong>{JSON.stringify(estimatedWeight)}<br />
        <strong>{' estimatedWeightV2: '}</strong>{JSON.stringify(estimatedWeightV2)}<br />
        <strong>{' weight: '}</strong>{JSON.stringify(weight)}<br /><br />
        <br />
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


