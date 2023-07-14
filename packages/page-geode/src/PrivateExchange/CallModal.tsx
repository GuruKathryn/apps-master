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

interface Props {
  className?: string;
  passListingID?: string;
  passOfferCoin?: string;
  passAskingCoin?: string;
  passPrice?: number;
  passMethod?: string;
  passInventory?: number;
  passCountry?: string;
  passCity?: string;
  passNotes?: string;
  hideThisListing?: boolean;
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

function CallModal ({ className = '', passListingID, passOfferCoin, passAskingCoin, passPrice, passMethod, 
                      passInventory, passCountry, passCity, passNotes, hideThisListing, 
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
  const [isHideListing, toggleHideListing] = useToggle(paramToBool(hideThisListing));

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);

  // for test
  const isShow: boolean = false;
  const isShowParams: boolean = true;

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
      header={t<string>('Geode Private Exchange ')}
      onClose={onClose}
    >
      <Modal.Content>
        
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
            {isShow && (<>
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

        {/* custom modal for this contract message... */}
        {messageIndex===1 && (<>
          <br />       
          <strong>{t<string>('Editing This Listing ID: ')}</strong><br />
          {params[0] = passListingID}
          <br /><h2><strong>{hexToString(passOfferCoin)}{t<string>('/')}{hexToString(passAskingCoin)}</strong></h2>
          <br />

          <strong>{t<string>('Price per coin in ')}{hexToString(passAskingCoin)}</strong>
          <Input label='' type="number" 
              value={params[1]}
              defaultValue={BNtoGeode(passPrice)}
              onChange={(e)=>{
              params[1]=e.target.value;
              setParams([...params]);
              }}
          ></Input>

          <strong>{t<string>('Method: explain how you want buyers to communicate with you, etc. ')}</strong>
          <Input label='' type="text" 
              value={params[2]}
              defaultValue={hexToString(passMethod)}
              onChange={(e)=>{
              params[2]=e.target.value;
              setParams([...params]);
              }}
          ></Input>

          <strong>{t<string>('Inventory: how much of the offer coin do you have for sale?')}</strong>
          <Input label='' type="number" 
              value={params[3]}
              defaultValue={BNtoGeode(passInventory)}
              onChange={(e)=>{
              params[3]=e.target.value;
              setParams([...params]);
              }}
          ></Input>

          <strong>{t<string>('Country: what country do you live in (for local sales)')}</strong>
          <Input label='' type="text" 
              value={params[4]}
              defaultValue={hexToString(passCountry)}
              onChange={(e)=>{
              params[4]=e.target.value;
              setParams([...params]);
              }}
          ></Input>

          <strong>{t<string>('City: what city do you live in (for local sales)')}</strong>
          <Input label='' type="text" 
              value={params[5]}
              defaultValue={hexToString(passCity)}
              onChange={(e)=>{
              params[5]=e.target.value;
              setParams([...params]);
              }}
          ></Input>

          <strong>{t<string>('Notes: what else should buyers know?')}</strong>
          <Input label='' type="text" 
              value={params[6]}
              defaultValue={hexToString(passNotes)}
              onChange={(e)=>{
              params[6]=e.target.value;
              setParams([...params]);
              }}
          ></Input>

          <strong>{t<string>('Hide This Listing? (click this toggle if the submit button does not show)')}</strong>
          <br />
          <Toggle
            className='booleantoggle'
            label={<strong>{t<string>(boolToString(isHideListing))}</strong>}
            onChange={() => {
              toggleHideListing()
              params[7] = isHideListing;
              setParams([...params]);
            }}
            value={isHideListing}
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
