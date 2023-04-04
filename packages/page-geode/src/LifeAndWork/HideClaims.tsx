// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from 'react';

import {  Table, List, Label } from 'semantic-ui-react'

import type { CallResult } from './types';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { AccountName, Button, Badge, IdentityIcon, Card, LabelHelp } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import Output from '@polkadot/app-js/Output';
//import CopyToClipboard from 'react-copy-to-clipboard';

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


function HideClaims ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const [isModalOpen, toggleModal] = useToggle();
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
    const claimIdRef: string[] = [' ', 'work history', 'education', 'expertise', 'good deeds', 'intellectual property', '', '', ' - Get Resume', '', '', '', ' - Search', '', '', '', '', '', ''];
    const [showButton, setShowButton] = useState(true);
    const showRef = useRef(0);
    const hideRef = useRef(0);

  //todo: code for allCodes:
  console.log(JSON.stringify(allCodes));

  let _Obj2: Object = {"ok":[{"claimtype":3,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x4e657720636c61696d206f6e2061206e657720636f6e7472616374","claimId":"0x11039a64fa59bb014e10a41cc97e5afaaadb21b7ce4e152ba44cfb65e7d9d6e7","endorserCount":0,"show":true,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]}
  const objOutput2: string = stringify(output);
  _Obj2 = JSON.parse(objOutput2);
  const claimDetail: ClaimDetail = Object.create(_Obj2);


function ListClaims(): JSX.Element {

    if (claimDetail.ok) {
      return(
        <div>
        <br />
        <Label color='blue' circular>{showRef.current}</Label>
        <strong>{t<string>(' Claim(s) Shown: ')}</strong>   
        <LabelHelp help={t<string>('  Copy the ClaimId below to Hide or Show. Then click the Hide/Show Claim button at the bottom of the page.')} />   <br /> 
        <List divided inverted relaxed >
          {claimDetail.ok.filter(_type => _type.show).map((_out, index: number) => 
          <List.Item> 
          <Label color='grey' circular>{t<string>('Claim ')}{showRef.current=index+1}{' '}</Label>
          <Label color='grey'
            >{isHex(_out.claim) ? t<string>(hexToString(_out.claim)) : ' '}</Label> 
          <Label circular color='blue'>{claimIdRef[_out.claimtype]}</Label>     
          <Label circular color='teal'> {_out.endorserCount} </Label>
          
          <strong>{' ClaimId: '}</strong>{_out.claimId}<br />
                <List divided inverted bulleted>
                {_out.endorsers.map((name, i: number) => <List.Item key={name}> 
                 {(i === 0) ? 
                 <><strong>{t<string>('Claim Endorsements:')}</strong>{t<string>('(self)')} {name}</> : 
                 <><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}{name} </>}
                </List.Item>)}
                </List>
                
          </List.Item>)}
          
        </List>
        <Label color='red' circular>{hideRef.current}</Label>
        <strong>{t<string>(' Claim(s) Hidden:')}</strong>
        <LabelHelp help={t<string>('  Copy the ClaimId below to Hide or Show. Then click the Hide/Show Claim button at the bottom of the page.')} />   <br /> 
        <List divided inverted relaxed >
          {claimDetail.ok.filter(_type => !_type.show).map((_out, index: number) => 
          <List.Item> 
          
          <Label color='red'
                 circular>{t<string>('Claim ')}{hideRef.current=index+1}{' '}</Label>
          <Label color='grey'
            >{isHex(_out.claim) ? t<string>(hexToString(_out.claim)) : ' '}</Label> 
          <Label circular color='blue'>{claimIdRef[_out.claimtype]}</Label>     
          <Label circular color='teal'> {_out.endorserCount} </Label>
          
          <strong>{t<string>(' ClaimId: ')}</strong>{_out.claimId}<br />
                <List divided inverted bulleted>
                {_out.endorsers.map((name, i: number) => <List.Item key={name}> 
                 {(i === 0) ? 
                 <><strong>{t<string>('Claim Endorsements:')}</strong>{t<string>('(self)')} {name}</> : 
                 <><Badge color='red' icon='check'/>{name} </>}
                </List.Item>)}
                </List>
                
          </List.Item>)}
        </List>
        </div>   
    )
  } else {
    return(
      <div>{t<string>(' No Claims to Show ')}</div>
    )
  }
}
function MakeHideClaim(): JSX.Element {
    return(
        <div>
            <strong>{t<string>('Instructions for Hiding and Showing Claims: ')}</strong><br />
            {'(1) '}{t<string>('Make Sure the (account to use) is the owner of the claims')}<br /> 
            {'(2) '}{t<string>('Copy the ClaimID for the claim to Hide/Show into the (claimHash: Hash) field below')}<br />
            {'(3) '}{t<string>('Set the (setShow: bool) field to either no (Hide) or yes (Show)')}<br />
            {'(4) '}{t<string>('Click Submit Button to sign and submit this transaction')}<br /><br />
            {t<string>('⚠️ Please Note: You must be the account owner to show or hide a claim.')}<br />
        <Table>
          <Table.Row>
            <Table.Cell>              
            <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={6}
             />
            </Table.Cell>
          </Table.Row>
        </Table>
        </div>
    )
}
function ListAccount(): JSX.Element {
try {
    setShowButton(true)
    return (
    <div>
      <Table>
        <Table.Row>
          <Table.Cell>
          <IdentityIcon value={from} />
          <AccountName value={claimDetail.ok[0].claimant} withSidebar={true}/>
          </Table.Cell>
          <Table.Cell>
          <strong>{t<string>(' Claim AccountId: ')}</strong>{claimDetail.ok[0].claimant}
          </Table.Cell>
          <Table.Cell>
          {' '}{when.toLocaleDateString()} 
          {' '}{when.toLocaleTimeString()} 
          </Table.Cell>
          <Table.Cell>
          <strong>{t<string>(' Key: ')}</strong>
          {t<string>(' Claim Types: ')}
          <Label circular color='blue'> {'?'} </Label>  
          {t<string>(' No. of Endorsements: ')}
          <Label circular color='teal'> {'#'} </Label>  
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
  )
} catch(error) {
    setShowButton(false)
    console.error(error);
    return(
        <>
        <strong>{t<string>('There are no claims to show.')}</strong>
        </>
    )
}}

  return (
    <StyledDiv className={className}>
    <Card>  
        <ListAccount />
        <Table>
          <Table.Row>
            <Table.Cell> 
            <strong>{t<string>(' Hide or Show a Claim: ')}</strong>
            <LabelHelp help={t<string>(' Use this card to select claims to hide or show on your Resume. By default all claims created are shown.')} /> <br />                      
            <ListClaims />
            </Table.Cell>
          </Table.Row>
        </Table>
        <Table>
            <Table.Row>
                <Table.Cell>
                {showButton && (
                    <>
                    <Button
                        icon={(isModalOpen) ? 'minus' : 'plus'}
                        //isDisabled={!isValid}
                        //label={t<string>('Claim Ids')}
                        label={t<string>('Hide/Show Claim')}
                        onClick={toggleModal} 
                    />        
                    </>
                )}
                </Table.Cell>
          </Table.Row>
        </Table>

    {isModalOpen && (
        <MakeHideClaim />
    )}
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

export default React.memo(HideClaims);


