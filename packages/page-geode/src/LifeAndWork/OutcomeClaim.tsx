// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/OutcomeClaims.tsx 

//import type { INumber } from '@polkadot/types/types';
import type { CallResult } from './types';

import React from 'react';
import styled from 'styled-components';

import { stringify, hexToString, isHex } from '@polkadot/util';

import { Button, IdentityIcon, Card } from '@polkadot/react-components';
import valueToText from '@polkadot/react-params/valueToText';
import { Table } from 'semantic-ui-react'
//import MessageSignature from '../shared/MessageSignature';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
  titleText?: string;
  isDetail?: boolean;
  isFullDetail?: boolean;
}

function OutcomeClaim ({ className = '', onClear, outcome: { from, message, output, params, result, when }, titleText, isDetail, isFullDetail }: Props): React.ReactElement<Props> | null {

let _Obj1: Object = {"ok":[2,"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","0x71776173",1,["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"]]}
const objOutput: string = stringify(output);
_Obj1 = JSON.parse(objOutput);

const myObj = Object.create(_Obj1);
const isShowStringify: boolean = true;
const isShowRaw: boolean = true;

return (
    <StyledDiv className={className}>
        <span>
        <strong>{titleText}</strong>
        <Card>
          <Table>
            <Table.Row>
                <Table.Cell>
                    <IdentityIcon value={from} />
                </Table.Cell>

                <Table.Cell>
                    {when.toLocaleDateString()} <br />
                    {when.toLocaleTimeString()} <br />
                </Table.Cell>
                
                <Table.Cell>
                {isDetail && (
                <div>
                    {isShowRaw && (
                        <>
                        <strong>{' Raw Data: '}</strong>
                                {valueToText('Text', result.isOk ? output : result)}
                        <br />
                        </>
                    )}
                    {isShowStringify && (
                        <>
                        
                        <strong>{' Stringified Data: '}</strong> 
                            {'Data: '}{objOutput} <br />
                            {'claimtype: '}{myObj.ok.claimtype} <br />
                            {'claimant: '}{myObj.ok.claimant} <br />
                            {'claim: '}{isHex(myObj.ok.claim) ? hexToString(myObj.ok.claim) : 'Not a claim ID'}<br />
                        </>
                    )}
                    {!isFullDetail && (
                        <>
                        <strong>{' Claim Data:'}</strong><br />
                        </>
                    )}
                </div>
                )}

                {!isDetail && (
                    <>
            <strong>{' Raw Data: '}</strong>{valueToText('Text', result.isOk ? output : result)}<br />
            <strong>{' Claim Data:'}</strong><br />
                    {' Id: '}{myObj.ok[0]}<br />
                    {' Id: '}{myObj.ok[1]}<br />
                    {' Id: '}{myObj.ok[2]}<br />
                    {' Id: '}{myObj.ok[3]}<br />
                    {' Id: '}{myObj.ok[4]}<br />
                    </>
                )}
                </Table.Cell>
                <Table.Cell>
                    <Button
                    icon='times'
                    onClick={onClear}
                    />
                </Table.Cell>
            </Table.Row>
          </Table>
        </Card>
      </span>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;

export default React.memo(OutcomeClaim);

