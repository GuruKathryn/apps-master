// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useState } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex, extractTime } from '@polkadot/util';
import { AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label, Image } from 'semantic-ui-react'
//import CopyInline from '../shared/CopyInline';

import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type FeedIndex = {
    maxfeed: number
  }

  type BlockedObj = {
    blocked: string[]
  }

  type MessageObj = {
    messageId: string,
    replyTo: string,
    from: string,
    username: string,
    message: string,
    link: string,
    endorserCount: number,
    replyCount: number,
    timestamp: string,
    endorsers: string[]
  }

  type FeedObj = {
    feedIndex: FeedIndex,
    blockedObj: BlockedObj,
    messageObj: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj[]
  }
  
function FeedDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    // example objects

    //let _Obj1: Object = { "ok":[{"account":"5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","display_name":"0x49276d20616e206578706572742047726f706f","location":"0x4a3252d1668288f51bb269a6c27c11fca6b227a79db2ec2e726180a1f845f02f","tags":"0x","bio":"0x68747470733a2f2f646576656c6f7065722e6d6f7a696c6c612e6f72672f656e2d55532f646f63732f5765622f4150492f46696c65526561646572","photo_url":"0x","website_url1":"0x", "website_url2":"0x", "website_url3":"0x", "life_and_work": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "social": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "private_messaging": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "marketplace": "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", "more_info": "0x", "make_private": false}]};
//    let _Obj: Object = { "ok": [ { "maxfeed": 10 }, { "blocked": [] } [ { "messageId": " ", "replyTo": " ", "from": " ", "username": " ", "message": " ", "link": " ", "endorserCount": 0, "replyCount": 0, "timestamp": " ", "endorsers": [ " " ] } ] ] };
//    let _Obj: Object = { Ok: [ { maxfeed: 10 } { blocked: [] } [ { messageId: 0x9f3f89a44bda20c54198da405ecdf6ffbd03507789921e81dd83272647c6b6fa replyTo: 0x0000000000000000000000000000000000000000000000000000000000000000 from: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty username: message: test link: https://thehappypuppysite.com/wp-content/uploads/2018/11/French-Bulldog-A-Complete-Guide-HP-long.jpg endorserCount: 0 replyCount: 0 timestamp: 1,681,564,410,005 endorsers: [ 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty ] } { messageId: 0xa784b7f1232d0f953cf78c04841d21a6136a60b45c6ce3e32a5e1f4971441be4 replyTo: 0x0000000000000000000000000000000000000000000000000000000000000000 from: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty username: Bob message: test post link: https://thehappypuppysite.com/wp-content/uploads/2018/11/French-Bulldog-A-Complete-Guide-HP-long.jpg endorserCount: 0 replyCount: 0 timestamp: 1,681,568,718,004 endorsers: [ 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty ] } ] ] }

    let _Obj: Object = { "ok":[{ "maxfeed": 10 }, { "blocked": [] }, [ { "messageId": "0x9f3f89a44bda20c54198da405ecdf6ffbd03507789921e81dd83272647c6b6fa", "replyTo": "0x0000000000000000000000000000000000000000000000000000000000000000", "from": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "username": "Bob", "message": "test", "link": "https://thehappypuppysite.com/wp-content/uploads/2018/11/French-Bulldog-A-Complete-Guide-HP-long.jpg", "endorserCount": 0, "replyCount": 0, "timestamp": "1681564410005", "endorsers": [ "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" ] } ] ] };
    //let _Obj: Object = { Ok: [ 10, { "blocked": [] }, [ { "messageId": "0x10342022c60109022b4661c5b2c920cef58163be08ca35bf5f0712e840463614", "replyTo": "0x0000000000000000000000000000000000000000000000000000000000000000", "from": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "username": "Bob's Feed", "message": "Here's my First Post - Gropo!", "link": "https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2240,c_limit/Monkey-Selfie.jpg", "endorserCount": 0, "replyCount": 0, "timestamp": 1681484172006, "endorsers": [ "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" ] } ] ] }
    //let _Obj: Object = { Ok: { "account": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "displayName": "test q", "location": "test w", "tags": "test r", "bio": "0x", "photoUrl": "0x", "websiteUrl1": "0x", "websiteUrl2": "0x", "websiteUrl3": "0x", "lifeAndWork": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "social": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "privateMessaging": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "marketplace": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "moreInfo": "0x", "makePrivate": false } }
    const objOutput: string = stringify(output);
    _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);


    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t<string>(str)}</>)
    }

    function ListAccount(): JSX.Element {
      try {
        //setIsClaim(true)
        return (
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
                </Table.Cell>
                <Table.Cell>
                <LabelHelp help={t<string>(' The account calling the information.')} /> 
                <strong>{t<string>(' Called from: ')}</strong>
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
      
function ShowFeed(): JSX.Element {

      try {
       // const time = extractTime(Math.abs(_out.timestamp));
       // const { days, hours, minutes, seconds } = time;
        return(
          <div>
          <strong>{'Show Feed is being Called'}</strong>
          {feedDetail.ok.map((_out, index: number) => 
            <div>
            <Card>
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <h2>{'Public Feed'}</h2>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
                {_out.messageObj.map(_msg =>
                    <><h3><strong>{'@'}{_msg.username}</strong></h3>
                    <Label color='blue' circular>{_msg.endorserCount}</Label>
                    <i>{_msg.timestamp}</i>
                    {_msg.replyCount}{'Replies'}<br /><br />
                    {(isHex(_msg.link) ? withHttp(hexToString(_msg.link).trim()) : defaultImage) !='' ? 
                        (
                        <>
                        <Image src={(isHex(_msg.link) ? withHttp(hexToString(_msg.link).trim()) : defaultImage)} size='small' circular />
                        </>
                        ) : (
                        <>
                        <Image src={defaultImage} size='small' circular />
                        </>
                    )}
                    <br /><br />
                    <Label  as='a'
                    color='orange'
                    circular
                    href={isHex(_msg.link) ? withHttp(hexToString(_msg.link).trim()) : ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{'Link'}
                    </Label>{' '}
                    {isHex(_msg.link) ? withHttp(hexToString(_msg.link).trim()) : ''}
                    <br />  
                    <h4><strong>{isHex(_msg.message) ? 
                        autoCorrect(searchWords, hexToString(_msg.message)) 
                        : ' '}</strong></h4>
                  </>
                )}
              </Table.Cell>
            </Table.Row>
        </Table>
        </Card>
        </div>   
        )
      }
      </div>)
          } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Social Data')}</Card>
        </div>
      )
    }
}
    

  return (
    <StyledDiv className={className}>
    <Card>
      <ListAccount />
      <ShowFeed />
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
export default React.memo(FeedDetails);
