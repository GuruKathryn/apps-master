// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React, { useCallback, useState } from 'react';
//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../translate';

//import { Feed, Icon } from 'semantic-ui-react'
import { Table, List, Label } from 'semantic-ui-react'

//import { Card } from '@polkadot/react-components';
import type { CallResult } from './types';
import { useToggle } from '@polkadot/react-hooks';

import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Button, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';

interface Props {
  className?: string;
  onClear?: () => void;
  isAccount: boolean;
  outcome: CallResult;
  //onClose: () => void;
}

type ClaimObj = {
  claimtype: number,
  claimant: string,
  claim: string,
  claimId: string,
  endorserCount: number,
  show: boolean,
  endorsers: string[]
  link: string
}

type ClaimDetail = {
ok: ClaimObj[]
}

type ClaimList = {
  claimIndex: number,
  noClaims: string
}

function Details ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isModalOpen, toggleModal] = useToggle();
  const claimIdRef: string[] = [' ', 'work history', 'education', 'expertise', 'good deeds', 'ip', '', '', ' - Get Resume', '', '', '', ' - Search', '', '', '', '', '', ''];
  const [isClaim, setIsClaim] = useState(false);

 let _Obj2: Object = {"ok":[{"claimtype":3,"claimant":"5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","claim":"0x49276d20616e206578706572742047726f706f","claimId":"0x4a3252d1668288f51bb269a6c27c11fca6b227a79db2ec2e726180a1f845f02f","endorserCount":0,"link":"0x68747470733a2f2f646576656c6f7065722e6d6f7a696c6c612e6f72672f656e2d55532f646f63732f5765622f4150492f46696c65526561646572","show":true,"endorsers":["5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc"]}]}
//  let _Obj2: Object = {"ok":[{"claimtype":3,"claimant":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","claim":"0x4e657720636c61696d206f6e2061206e657720636f6e7472616374","claimId":"0x11039a64fa59bb014e10a41cc97e5afaaadb21b7ce4e152ba44cfb65e7d9d6e7","endorserCount":0,"show":true,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]}
  const objOutput2: string = stringify(output);
  _Obj2 = JSON.parse(objOutput2);
  const claimDetail: ClaimDetail = Object.create(_Obj2);

//const bnTest: boolean = false;

function ListClaims(props:ClaimList): JSX.Element {
  if (claimDetail.ok) {
    return(
      <div>
      <List divided inverted relaxed >
        {claimDetail.ok.filter(_type => _type.claimtype===props.claimIndex && _type.show).map((_out, index: number) => 
        <List.Item> 
        {isAccount && (<IdentityIcon value={_out.claimant} />)}
        <Label  as='a' 
                color='grey'
              
                >{isHex(_out.claim) ? hexToString(_out.claim) : ' '}</Label> {' '}                  
        <Label circular color='teal'> {_out.endorserCount} </Label> 
        {hexToString(_out.link)!='' && (
            <>
        <Label  as='a'
                color='orange'
                circular
                href={isHex(_out.link) ? hexToString(_out.link) : ' '}
                target="_blank" 
                rel="noopener noreferrer"
                >{'Link'}
        </Label>
            </>
        )}
        </List.Item>)}
      </List>
      
      </div>   
  )
} else {
  return(
    <div>{t<string>(props.noClaims)}</div>
  )
}
}

function ListAccount(): JSX.Element {
try {
  setIsClaim(true)
  return (
    <div>
      <Table>
        <Table.Row>
          <Table.Cell>
          <IdentityIcon value={from} />
          </Table.Cell>
          <Table.Cell>
          {t<string>('Date/Time: ')}
          {' '}{when.toLocaleDateString()} 
          {' '}{when.toLocaleTimeString()} 
          </Table.Cell>
          <Table.Cell>
          {!isAccount && (
          <><IdentityIcon value={claimDetail.ok[0].claimant} />  
          {t<string>(' Claim AccountId: ')}{claimDetail.ok[0].claimant}
          </>
          )}
          </Table.Cell>
          <Table.Cell>
          <strong>{t<string>(' Key: ')}</strong>
          {t<string>(' No. of Endorsements: ')}
          <Label circular color='teal'> # </Label>  
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
  )
} catch(error) {
  console.error(error)
  setIsClaim(false)
  return(
    <>
    <strong>{t<string>('There are no claims available.')}</strong>
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
              <LabelHelp help={t<string>(' Claims for Subject Matter Expertise')} /> 
              <strong>{t<string>(' Expertise:')}</strong><br /><br />
              <ListClaims
                claimIndex={3}
                noClaims={t<string>('There are no Expertise Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell>
              <LabelHelp help={t<string>(' Claims for Education and Specialized Training')} /> 
              <strong>{t<string>(' Education:')}</strong><br /><br />
              <ListClaims
                claimIndex={2}
                noClaims={t<string>('There are no Education Claims for this account')}
               />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
          <Table.Cell>
              <LabelHelp help={t<string>(' Claims for Work History, Past and Current Employment')} /> 
              <strong>{t<string>(' Work History:')}</strong><br /><br />
              <ListClaims
                claimIndex={1}
                noClaims={t<string>('There are no Work History Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell>
            <LabelHelp help={t<string>(' Claims for Good Deeds and Contributions to Society and Public Welfare')} /> 
              <strong>{t<string>(' Good Deeds:')}</strong><br /><br />
              <ListClaims
                claimIndex={4}
                noClaims={t<string>('There are no Good Deed Claims for this account')}
               />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
            <LabelHelp help={t<string>(' Claims Original Intellectual Property including Books, Music, Art, Research Papers, Engineering Documents and/or other Patentable')} /> 
              <strong>{t<string>(' Intellectual Property:')}</strong><br /><br />
              <ListClaims
                claimIndex={5}
                noClaims={t<string>('There are no Intellectual Property Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell>
              <strong>{' '}</strong><br /><br />
              <div>
                {' '}
              </div>
            </Table.Cell>
          </Table.Row>
        </Table>
        {isClaim && (
        <Table>
        <Table.Row>
            <Table.Cell>
                <Button
                    icon={(isModalOpen) ? 'minus' : 'plus'}
                    label={t<string>('Claim Details')}
                    onClick={toggleModal} 
                />        
            </Table.Cell>
        </Table.Row>
        </Table>                    
        )}

        {isModalOpen && (
            <>
            <Table>
              <Table.Row>
                <Table.Cell>
                {!isAccount ? (
                    <>
                    <IdentityIcon value={claimDetail.ok[0].claimant} />
                    {' Claim AccountID: '}<strong>{claimDetail.ok[0].claimant}</strong>
                    </>
                ) : 'Details of Search Results:'}          
                </Table.Cell>
                <Table.Cell>
                {'Date/Time: '}
                <strong>{' '}{when.toLocaleDateString()}</strong> 
                <strong>{' '}{when.toLocaleTimeString()}</strong>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>

                <div>
                <List divided inverted relaxed >
                {claimDetail.ok.filter(_type => _type.show).map((_out, index: number) => 
                <List.Item> 
                {isAccount && (<IdentityIcon value={_out.claimant} />)}
                <Label color='teal' circular>{'No.'}{index+1}</Label>
                <Label color='grey'>{isHex(_out.claim) ? hexToString(_out.claim) : ' '}</Label> {' '}<br />
                {isAccount && (<>{' accountId: '}{_out.claimant}<br /></>)}
                {hexToString(_out.link)!='' && (<>
                {' claim Link: '}{isHex(_out.link) ? hexToString(_out.link) : ' '}<br /></>)}
                {' claim Type: '}{claimIdRef[_out.claimtype]}<br />
                {' claim Id: '}{_out.claimId}<br />
                {' number of Endorsements: '}<Label circular color='teal'> {_out.endorserCount} </Label> 
                </List.Item>)}
                </List>
                </div>   
                </Table.Cell>
              </Table.Row>
            </Table>
            </>
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

export default React.memo(Details);
