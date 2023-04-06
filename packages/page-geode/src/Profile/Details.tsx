// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { AccountName, Button, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label } from 'semantic-ui-react'

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount: boolean;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type ProfileObj = {
    account: string,
    displayName: number,
    location: number,
    tags: number,
    bio: number,
    photoUrl: number,
    websiteUrl1: number,
    websiteUrl2: number,
    websiteUrl3: number,
    lifeAndWork: string,
    social: string,
    privateMessaging: string,
    marketplace: string,
    moreInfo: number,
    makePrivate: boolean
  }
  
  type ProfileDetail = {
  ok: ProfileObj
  }
  
function Details ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    //let _Obj1: Object = {"ok":[{"account":"5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","display_name":"0x49276d20616e206578706572742047726f706f","location":"0x4a3252d1668288f51bb269a6c27c11fca6b227a79db2ec2e726180a1f845f02f","tags":"0x","bio":"0x68747470733a2f2f646576656c6f7065722e6d6f7a696c6c612e6f72672f656e2d55532f646f63732f5765622f4150492f46696c65526561646572","photo_url":"0x","website_url1":"0x", "website_url2":"0x", "website_url3":"0x", "life_and_work": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "social": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "private_messaging": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "marketplace": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "more_info": "0x", "make_private": false}]};
    let _Obj: Object = { Ok: { "account": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "displayName": "test q", "location": "test w", "tags": "test r", "bio": "0x", "photoUrl": "0x", "websiteUrl1": "0x", "websiteUrl2": "0x", "websiteUrl3": "0x", "lifeAndWork": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "social": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "privateMessaging": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "marketplace": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "moreInfo": "0x", "makePrivate": false } }
    const objOutput: string = stringify(output);
    _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);
  
    function ListAccount(): JSX.Element {
      try {
        //setIsClaim(true)
        return (
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
                {!isAccount && (
                <>
                <strong>{t<string>('Profile of: ')}</strong>
                <IdentityIcon value={profileDetail.ok.account} />  
                <AccountName value={profileDetail.ok.account} withSidebar={true}/>    
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
                {t<string>(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>  
                </Table.Cell>
              </Table.Row>
            </Table>
          </div>
        )
      } catch(error) {
        console.error(error)
        //setIsClaim(false)
        return(
          <div>
          <Table>
            <Table.Row>
              <Table.Cell>
              <strong>{t<string>('There are no profiles available.')}</strong>
              </Table.Cell>
              <Table.Cell>
              <strong>{t<string>('Date/Time: ')}</strong>
                {' '}{when.toLocaleDateString()} 
                {' '}{when.toLocaleTimeString()} 
              </Table.Cell>
            </Table.Row>
          </Table>
          </div>
        )
      }}
      
function ShowProfile(): JSX.Element {
      try {
        return(
          <div>
          

            <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Header</Table.HeaderCell>
              <Table.HeaderCell>Header</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell>
                {'Image goes here'}<br />
                {profileDetail.ok.photoUrl}
                {'Tags go here:'}<br />
                {profileDetail.ok.tags}
            </Table.Cell>
            <Table.Cell>
                {'Display Name:'}<br />
                <IdentityIcon value={profileDetail.ok.account} />
                <AccountName value={profileDetail.ok.account} withSidebar={false}/><br />
                <strong>{t<string>('Account:')} </strong> {profileDetail.ok.account}
                {'bio text:'}<br />  
                {profileDetail.ok.bio} <br />        
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
                {'web sites here:'}<br />
                {profileDetail.ok.websiteUrl1} <br />
                {profileDetail.ok.websiteUrl2} <br />
                {profileDetail.ok.websiteUrl3} <br />
            </Table.Cell>
            <Table.Cell>
                <strong>{'Find Me On Geode Apps'}</strong><br />
                {profileDetail.ok.lifeAndWork} <br />
                {profileDetail.ok.social} <br />
                {profileDetail.ok.privateMessaging} <br />
                {profileDetail.ok.marketplace} <br /><br />

                {'more goes here:'}<br />
                {profileDetail.ok.moreInfo} <br />

            </Table.Cell>
          </Table.Row>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Profile Data')}</Card>
        </div>
      )
    }
}
    

  return (
    <StyledDiv className={className}>
    <Card>
      <ListAccount />
      <ShowProfile />
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
