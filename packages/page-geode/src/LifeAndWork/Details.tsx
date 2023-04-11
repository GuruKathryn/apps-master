// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslation } from '../translate';

import { Table, List, Label, Divider } from 'semantic-ui-react'

import type { CallResult } from './types';
import { useToggle } from '@polkadot/react-hooks';

import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { AccountName, Badge, Button, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import CopyInline from '../shared/CopyInline';
import JSONprohibited from '../shared/geode_prohibited.json';


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
  const searchWords: string[] = JSONprohibited;

 let _Obj2: Object = {"ok":[{"claimtype":3,"claimant":"5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","claim":"0x49276d20616e206578706572742047726f706f","claimId":"0x4a3252d1668288f51bb269a6c27c11fca6b227a79db2ec2e726180a1f845f02f","endorserCount":0,"link":"0x68747470733a2f2f646576656c6f7065722e6d6f7a696c6c612e6f72672f656e2d55532f646f63732f5765622f4150492f46696c65526561646572","show":true,"endorsers":["5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc"]}]}
  const objOutput2: string = stringify(output);
  _Obj2 = JSON.parse(objOutput2);
  const claimDetail: ClaimDetail = Object.create(_Obj2);

  function autoCorrect(arr: string[], str: string): JSX.Element {
    arr.forEach(w => str = str.replaceAll(w, '****'));
    arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '@***'));
    arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '*@**'));        
    arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
    return (
    <>{t<string>(str)}</>)
}

  const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

//const isShowTest: boolean = true;

function ListClaims(props:ClaimList): JSX.Element {
  if (claimDetail.ok) {
    return(
      <div>
      <List divided inverted relaxed >
        {claimDetail.ok.filter(_type => _type.claimtype===props.claimIndex && _type.show).map((_out, index: number) => 
        <List.Item> 
              {isAccount && (
              <>
              <IdentityIcon value={_out.claimant} />
              <AccountName value={_out.claimant} withSidebar={true}/>
              <br /><br />
              </>)}
              <CopyInline value={_out.claimId} label={''}/>
              <Label  
                color='grey'
                >{isHex(_out.claim) ? autoCorrect(searchWords, hexToString(_out.claim)) : ' '}</Label> {' '}                  
              <Label circular color='teal'> {_out.endorserCount} </Label> 
              {hexToString(_out.link)!='' && (
              <>
              <Label  as='a'
                color='orange'
                circular
                href={isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
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
          {!isAccount && (
          <>
          <strong>{t<string>('Resume of: ')}</strong>
          <IdentityIcon value={claimDetail.ok[0].claimant} />  
          <AccountName value={claimDetail.ok[0].claimant} withSidebar={true}/>    
          </>
          )}
          </Table.Cell>
          <Table.Cell>
            <strong>{t<string>('Called from: ')}</strong>
          <IdentityIcon value={from} />
          <AccountName value={from} withSidebar={true}/>
          </Table.Cell>

          <Table.Cell>
          <strong>{t<string>('Date/Time: ')}</strong>
          {' '}{when.toLocaleDateString()} 
          {' '}{when.toLocaleTimeString()} 
          </Table.Cell>
          <Table.Cell>
          <strong>{t<string>(' Key: ')}</strong>
          {t<string>( ' Copy Claim ID: ')}
          <CopyInline value={'0x'} label={''}/>
          {t<string>(' No. of Endorsements: ')}
          <Label circular color='teal'> # </Label>  
          {t<string>(' Link to See More: ')}
          <Label circular color='orange'> Link </Label>  
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

function ListShownClaims(): JSX.Element {
  if (claimDetail.ok) {
    return(
      <div>
      <Badge color='blue' icon='thumbs-up' />
    
      <strong>{t<string>(' Claim(s) Shown: ')}</strong>   
      <LabelHelp help={t<string>('  Claim Details. Copy the ClaimId below to Endorse, Hide or Show Claims.')} />   <br /> 
      
      <List divided inverted relaxed >
        {claimDetail.ok.filter(_type => _type.show).map((_out, index: number) => 
        <List.Item> 
            {isAccount ? (
            <>
              <IdentityIcon value={_out.claimant} />
              <AccountName value={_out.claimant} withSidebar={false}/>
              <strong>{t<string>(' | account Id: ')}</strong>{_out.claimant}
              <LabelHelp help={t<string>('  Copy Address and add to your Address Book.')} />   
              <br /><br />
            </>    
            ) : (
              <><Label color='grey' circular>{t<string>('Claim ')}{index+1}{' '}</Label></>
            )}
        <Label color='grey'
          >{isHex(_out.claim) ? autoCorrect(searchWords, hexToString(_out.claim)) : ' '}</Label> 
        <Label circular color='blue'>{claimIdRef[_out.claimtype]}</Label>     
        <Label circular color='teal'> {_out.endorserCount} </Label>
        <br /><br />
        <Badge color='orange' icon='copy' />
        <strong>{' ClaimId: '}</strong>{_out.claimId}{' '}
        <CopyInline value={_out.claimId} label={''}/>
        <LabelHelp help={t<string>('  This is the claim ID. Copy and use this ID number to Endorse, Hide and Show Claims. ')} /> 
        <br />
        {hexToString(_out.link)!='' && (
          <>
              <Badge color='orange' icon='link'/>{' '}
              {isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
              <Label  as='a'
                color='orange'
                circular
                href={isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
                target="_blank" 
                rel="noopener noreferrer"
              >{'Link'}
              </Label>
          </>
      )}
              <List divided inverted bulleted>
              {_out.endorsers.map((name, i: number) => <List.Item key={name}> 
               {(i === 0) ? 
               <><strong>{t<string>('Claim Endorsements:')}</strong>{t<string>('(self)')} {name}</> : 
               <><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}{name} </>}
              </List.Item>)}
              </List>     
        <Divider />
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

function ListHiddenClaims(): JSX.Element {
  if (claimDetail.ok) {
    return(
      <div>
      <Badge color='red' icon='thumbs-down' />
      <strong>{t<string>(' Claim(s) Hidden:')}</strong>
      <LabelHelp help={t<string>('  Copy the ClaimId below to Hide or Show. Then click the Hide/Show Claim button at the bottom of the page.')} />   <br /> 
      <List divided inverted relaxed >
        {claimDetail.ok.filter(_type => !_type.show).map((_out, index: number) => 
        <List.Item> 
          {isAccount ? (
            <>
              <IdentityIcon value={_out.claimant} />
              <AccountName value={_out.claimant} withSidebar={false}/>
              <strong>{t<string>(' | account Id: ')}</strong>{_out.claimant}
              <br /><br />
            </>    
            ) : (
              <><Label color='red' circular>{t<string>('Claim ')}{index+1}{' '}</Label></>
            )}
        <Label color='grey'
          >{isHex(_out.claim) ? autoCorrect(searchWords, hexToString(_out.claim)) : ' '}</Label> 
        <Label circular color='blue'>{claimIdRef[_out.claimtype]}</Label>     
        <Label circular color='teal'> {_out.endorserCount} </Label>
        <br /><br />
        <Badge color='orange' icon='copy' />
        <strong>{' ClaimId: '}</strong>{_out.claimId}
        <LabelHelp help={t<string>('  This is the claim ID. Copy and use this ID number to Endorse, Hide and Show Claims. ')} /> 
        <br />
        {hexToString(_out.link)!='' && (
          <>
              <Badge color='orange' icon='link'/>{' '}
              {isHex(_out.link) ? hexToString(_out.link) : ' '}
              <Label  as='a'
                color='orange'
                circular
                href={isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
                target="_blank" 
                rel="noopener noreferrer"
              >{'Link'}
              </Label>
          </>
      )}
              <List divided inverted bulleted>
              {_out.endorsers.map((name, i: number) => <List.Item key={name}> 
               {(i === 0) ? 
               <><strong>{t<string>('Claim Endorsements:')}</strong>{t<string>('(self)')} {name}</> : 
               <><Badge color='red' icon='check'/>{name} </>}
              </List.Item>)}
              </List>
        <Divider  />
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



  return (
    <StyledDiv className={className}>
    <Card>  
        <ListAccount />
        <Table verticalAlign='top'>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              <LabelHelp help={t<string>(' Claims for Subject Matter Expertise')} /> 
              <strong>{t<string>(' Expertise:')}</strong><br /><br />
              <ListClaims
                claimIndex={3}
                noClaims={t<string>('There are no Expertise Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell verticalAlign='top'>
              <LabelHelp help={t<string>(' Claims for Education and Specialized Training')} /> 
              <strong>{t<string>(' Education:')}</strong><br /><br />
              <ListClaims
                claimIndex={2}
                noClaims={t<string>('There are no Education Claims for this account')}
               />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
          <Table.Cell verticalAlign='top'>
              <LabelHelp help={t<string>(' Claims for Work History, Past and Current Employment')} /> 
              <strong>{t<string>(' Work History:')}</strong><br /><br />
              <ListClaims
                claimIndex={1}
                noClaims={t<string>('There are no Work History Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell verticalAlign='top'>
            <LabelHelp help={t<string>(' Claims for Good Deeds and Contributions to Society and Public Welfare')} /> 
              <strong>{t<string>(' Good Deeds:')}</strong><br /><br />
              <ListClaims
                claimIndex={4}
                noClaims={t<string>('There are no Good Deed Claims for this account')}
               />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <LabelHelp help={t<string>(' Claims for Original Intellectual Property including Books, Music, Art, Research Papers, Engineering Documents and/or other Patentable Materials')} /> 
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
                <Table.Cell verticalAlign='top'>
                {!isAccount ? (
                    <>
                    <strong>{t<string>('Resume of: ')}</strong>
                    <IdentityIcon value={claimDetail.ok[0].claimant} />
                    <AccountName value={claimDetail.ok[0].claimant} withSidebar={true}/>
                    <strong>{t<string>(' | Account Id: ')}</strong>{claimDetail.ok[0].claimant}
                    </>
                ) : t<string>('Details of Search Results:')}          
                </Table.Cell>
                <Table.Cell verticalAlign='top'>
                <strong>{t<string>('Date/Time: ')}</strong>
                {' '}{when.toLocaleDateString()}
                {' '}{when.toLocaleTimeString()}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div>
                    <ListShownClaims />
                    <ListHiddenClaims />
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
