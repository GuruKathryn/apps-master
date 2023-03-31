// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React, { useCallback, useState } from 'react';
import React from 'react';

import { Table, List, Label } from 'semantic-ui-react'

//import { Card } from '@polkadot/react-components';
import type { CallResult } from './types';

import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Output, Badge, IdentityIcon, Card } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

type ClaimObj = {
  claimtype: number,
  claimant: string,
  claim: string,
  claimId: string,
  endorserCount: number,
  show: boolean,
  endorsers: string[]
}

type ClaimDetail = {
ok: ClaimObj[]
}

function ClaimIds ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  let _Obj2: Object = {"ok":[{"claimtype":3,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x4e657720636c61696d206f6e2061206e657720636f6e7472616374","claimId":"0x11039a64fa59bb014e10a41cc97e5afaaadb21b7ce4e152ba44cfb65e7d9d6e7","endorserCount":0,"show":true,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]}
  const objOutput2: string = stringify(output);
  _Obj2 = JSON.parse(objOutput2);
  const claimDetail: ClaimDetail = Object.create(_Obj2);

//const bnTest: boolean = false;

function ListClaimIds(): JSX.Element {
  const claimIdRef: string[] = [' ', 'work history', 'education', 'expertise', 'good deeds', 'intellectual property', '', '', ' - Get Resume', '', '', '', ' - Search', '', '', '', '', '', ''];

    if (claimDetail.ok) {
      return(
        <div>
        <Badge color='green' icon='thumbs-up'/>
        <strong>{t<string>('Claims Shown:')}</strong><br />
        <List divided inverted relaxed >
          {claimDetail.ok.filter(_type => _type.show).map(_out => 
          <List.Item> 
          <Badge color='green' icon='thumbs-up'/>
          <Label color='grey'>{isHex(_out.claim) ? hexToString(_out.claim) : ' '}</Label> 
          <Label circular color='blue'>{t<string>(claimIdRef[_out.claimtype])}</Label>     
          <Label circular color='teal'> {_out.endorserCount} </Label>
          <Output
                  className='output'
                  //isError={!result.isOk}
                  //isSmall
                  isTrimmed
                  isMonospace
                  withCopy
                  //label={'claimId'}
                  value={_out.claimId}
                  />
          </List.Item>)}
          
        </List>
        <Badge color='red' icon='thumbs-down'/>
        <strong>{t<string>('Claims Hidden:')}</strong><br />
        <List divided inverted relaxed >
          {claimDetail.ok.filter(_type => !_type.show).map(_out => 
          <List.Item> 
          <Badge color='red' icon='thumbs-down'/>
          {isHex(_out.claim) ? hexToString(_out.claim) : ' '} {' '}          
          <Label circular color='blue'>{_out.claimtype}</Label>     
          <Label circular color='teal'> {_out.endorserCount} </Label> 
          <Output
                  className='output'
                  //isError={!result.isOk}
                  //isSmall
                  isTrimmed
                  isMonospace
                  withCopy
                  //label={'claimId'}
                  value={_out.claimId}
                  />          
          </List.Item>)}
        </List>
        </div>   
    )
  } else {
    return(
      <div>{t<string>(' No Expertise Claims ')}</div>
    )
  }
}

function ListAccount(): JSX.Element {
  try{
    return (
      <div>
        <Table>
          <Table.Row>
            <Table.Cell>
            <IdentityIcon value={from} />
            </Table.Cell>
            <Table.Cell>
            {' '}{when.toLocaleDateString()} 
            {' '}{when.toLocaleTimeString()} 
            </Table.Cell>
            <Table.Cell>
            <IdentityIcon value={claimDetail.ok[0].claimant} />
            <strong>{t<string>(' Claim AccountId: ')}</strong>{claimDetail.ok[0].claimant}
            </Table.Cell>
            <Table.Cell>
            <strong>{t<string>(' Key: ')}</strong>
            {t<string>(' Claim Types: ')}
            <Label circular color='blue'> # </Label>  
            {t<string>(' No. of Endorsements: ')}
            <Label circular color='teal'> # </Label>  
            </Table.Cell>
          </Table.Row>
        </Table>
      </div>
    )  
  } catch(error){
    console.error(error);
    return(
        <>
        <strong>{t<string>('There are no claims to show.')}</strong>
        </>
    )
  }
}

  return (
    <StyledDiv className={className}>
    <Card>  
        <ListAccount />
        <Table>
          <Table.Row>
            <Table.Cell>              
              <strong>{t<string>('Claims by ClaimIds:')}</strong><br /><br />
              <ListClaimIds />
            </Table.Cell>
          </Table.Row>
        </Table>
    </Card>
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

export default React.memo(ClaimIds);
