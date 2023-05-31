// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx
import { Input } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from './types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Expander, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton, LabelHelp } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';

import FeedDetails from './FeedDetails';
import PaidFeedDetails from './PaidFeedDetails';
import StatDetails from './StatDetails';
import SearchDetails from './SearchDetails';
import KeywordDetails from './KeywordDetails';

import { getCallMessageOptions } from './util';
import JSONhelp from '../shared/geode_social_help.json';
import JSONnote from '../shared/geode_social_note.json';
import JSONTitle from '../shared/geode_social_card_titles.json';
import JSONTier1Help from '../shared/geode_social_tier1_help.json';
import JSONTier2Help from '../shared/geode_social_tier2_help.json';

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
  const isClosed = (isCalled && (messageIndex === 9 || messageIndex === 14 || messageIndex===10 || messageIndex===11 || messageIndex===13));
  const _help: string[] = JSONhelp;
  const _note: string[] = JSONnote;
  const _title: string[] = JSONTitle;
  const _tierOne: string[] = JSONTier1Help;
  const _tierTwo: string[] = JSONTier2Help;

  
  return (
    <Card >
        <h2>
        <Badge icon='info' color={'blue'} /> 
        <strong>{t<string>(' Geode Social ')}</strong>
        {t<string>(_title[messageIndex])}
        </h2>
        <Expander 
            className='viewInfo'
            isOpen={false}
            summary={<strong>{t<string>('Instructions: ')}</strong>}>
            {t<string>(_help[messageIndex])}<br /><br />
            {t<string>(_note[messageIndex])}<br /><br />
            <Badge color='blue' icon='info'/>
            {t<string>(_tierOne[messageIndex])}<br />
            <Badge color='blue' icon='info'/>
            {t<string>(_tierTwo[messageIndex])}

        </Expander>
        {isTest && (
          <InputAddress
          //help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
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
        </>
        )}  
      
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
            
            {!isClosed && messageIndex!=1 && messageIndex!=8 && messageIndex!=13 && (<>
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

      {messageIndex===8 && (<>
        {t<string>('Username: ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        {t<string>('My Interests: ')}<br />
        <Input label={''} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
        {t<string>('Number of Posts to Show in my Feed: ')}<br />
        <Input label={''} type="text"
        value={params[2]}
        onChange={(e) => {
          params[2] = e.target.value;
          setParams([...params]);
        }}
      />
        {t<string>('Number of Paid Posts to Show in my Paid Feed: ')}<br />
        <Input label={''} type="text"
        value={params[3]}
        onChange={(e) => {
          params[3] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}

    {!isClosed && messageIndex===13 && (<>
        {t<string>('Keyword(s) to Search: ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}


    {messageIndex===1 && (<>
        {t<string>('Paid Post Message: ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        {t<string>('Photo or YouTube Link: ')}<br />
        <Input label={''} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
        {t<string>('Website or Document Link: ')}<br />
        <Input label={''} type="text"
        value={params[2]}
        onChange={(e) => {
          params[2] = e.target.value;
          setParams([...params]);
        }}
        />
        {t<string>('Maximum Number of Paid Endorsers: ')}<br />
        <Input label={''} type="text"
        value={params[3]}
        onChange={(e) => {
          params[3] = e.target.value;
          setParams([...params]);
        }}
        />
        {t<string>('Target Interests: ')}<br />
        <Input label={''} type="text"
        value={params[4]}
        onChange={(e) => {
          params[4] = e.target.value;
          setParams([...params]);
        }}
        />
        {t<string>('Total Geode to spend across all Endorsers: ')}<br />
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
        {outcomes.length > 0 && messageIndex===9 &&  (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <FeedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
                onClose={isCalled}
              
              />
              {isTest && (<>{JSON.stringify(outcome.output)}</>)}
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===10 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <PaidFeedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              {isTest && (<>{JSON.stringify(outcome.output)}</>)}
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===11 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <SearchDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              {isTest && (<>{JSON.stringify(outcome.output)}</>)}
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===13 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <KeywordDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              {isTest && (<>{JSON.stringify(outcome.output)}</>)}
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===14 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <StatDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              {isTest && (<>{JSON.stringify(outcome.output)}</>)}
              </>
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


