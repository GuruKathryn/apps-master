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
//const claimType: string[] = [' ', 'Work History', 'Education', 'Expertise',  'Good Deeds', 'Intellectual Property'];
//const claimIndex: number = myObj.ok[0]>0 ? myObj.ok[0] : 1;
const isShowStringify: boolean = true;
const isShowRaw: boolean = true;

//const JSONTestOutput: Object = {"ok":[{"claimtype":3,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x6d7920636c61696d","endorsements": 1,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"]}, {"claimtype":1, "claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x6d7920636c61696d","endorsements": 0,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]},{"claimtype":2,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x6d7920636c61696d","endorsements": 1,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"]}, {"claimtype":3,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x6d7920636c61696d","endorsements": 0,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}, {"claimtype":2,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x6d7920636c61696d","endorsements": 0,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]};
  


//{"ok":{
//"claimtype":3,
//"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
//"claim":"0x6d7920636c61696d",
//"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}}

//let endorser: string = typeof myObj.ok[4] === "string" ?  myObj.ok[4].slice(0, 7): 'test';
 //endorser = endorser.slice(0, 8);
// let endorsers: string[] = [];
//     endorsers.push(endorser.slice(1, 7));

    //endorser[0] = '';
// let _Obj2: Object = {}
// const endorseObj: Object = JSON.parse(myObj.ok[4]);
//{"ok":[3,"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","0x71776173",0,["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]]}

// { Ok: [ 2 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty education monkey claim 1 [ 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY ] ] }

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

// {objOutput}<br /><br />
// {valueToText('Text', result.isOk ? output : result)}<br />


// <IdentityIcon value={from} />
// <Output
//   className='output'
//   isError={!result.isOk}
//   isFull
//   label={
//     <MessageSignature
//       message={message}
//       params={params}
//     />
//   }
//   labelExtra={
//     <span className='date-time'>
//       {'Date: '} {when.toLocaleDateString()}
//       {' Time: '}
//       {when.toLocaleTimeString()} 
//     </span>
//   }
//   value={valueToText('Text', result.isOk ? output : result)}
// />
// <Button
//   icon='times'
//   onClick={onClear}
// />
