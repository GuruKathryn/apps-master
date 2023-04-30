// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Button, Badge, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { List, Table, Label, Image, Divider } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle } from '@polkadot/react-hooks';
import AccountHeader from '../shared/AccountHeader';

import JSONprohibited from '../shared/geode_prohibited.json';
//import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    isShowEndorsers: boolean;
    isShowMessageID: boolean;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type MessageObj = {
    messageId: string,
    replyTo: string,
    fromAcct: string,
    username: string,
    message: string,
    link: string,
    endorserCount: number,
    replyCount: number,
    timestamp: number,
    endorsers: string[]
  }

  type FeedObj = {
    maxfeed: number,
    blocked: string[],
    myfeed: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }
  
function FeedDetails ({ className = '', onClear, isShowEndorsers, isShowMessageID, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    //const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    //const [isReply, toggleReply] = useToggle(true);

    const isReply: boolean = true;
    const isReplyToReply: boolean = false;

    const [feedIndex, setFeedIndex] = useState(0);
    const [countPost, setCountPost] = useState(0);

    //const isShowBlockedAccounts: boolean = true;
    const [isShowBlockedAccounts, toggleShowBlockedAccounts] = useToggle(false);
    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    //const isShowMsgId: boolean = true;

    // example objects
    let _Obj: Object = {"ok": {"maxfeed":10, "blocked":["5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL","5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"], "myfeed": [ {"messageId":"0xb92283bc2400d530a60ee0cd73a992ce73d72af846608205d51427ba55be72af","replyTo":"0x0000000000000000000000000000000000000000000000000000000000000000","fromAcct":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","username":"0x426f62","message":"0x466972737420706f7374","link":"0x68747470733a2f2f6d656469612e6973746f636b70686f746f2e636f6d2f69642f313330333433363033322f70686f746f2f6672656e63682d62756c6c646f672d6f6e2d7468652d67726173732d696e2d7468652d7061726b2d62656175746966756c2d646f672d62726565642d6672656e63682d62756c6c646f672d696e2d617574756d6e2d6f7574646f6f722e6a70673f623d3126733d3137303636376126773d30266b3d323026633d5a574f4b4f624133665939685756512d53505472454b53534c4f5577626442347168567a6a3749633773383d","endorserCount":0,"replyCount":0,"timestamp":1681657752005,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]},{"messageId":"0xc76570158d247a1907b01ced4ea2ba29a8c6bff29165d85ca1183e0a35b1fe35","replyTo":"0x0000000000000000000000000000000000000000000000000000000000000000","fromAcct":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","username":"0x426f62","message":"0x5365636f6e6420506f7374","link":"0x68747470733a2f2f74342e667463646e2e6e65742f6a70672f30302f39322f30342f38392f3336305f465f39323034383937395f4d50735a3074466c686477436653515a53463541554979476e30696f7a447a422e6a7067","endorserCount":0,"replyCount":0,"timestamp":1681657794005,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]}}
    const objOutput: string = stringify(output);
    _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    //console.log(Object.values(feedDetail.ok.myFeed.messageId.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{})))
    
    //[...new Set(feedDetail)];

    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t<string>(str)}</>)
    }

    function timeStampToDate(tstamp: number): JSX.Element {
       // const event = new Date(1681657752005);
       try {
        const event = new Date(tstamp);
        return (
             <><i>{event.toDateString()}{' '}
                  {event.toLocaleTimeString()}{' '}</i></>
         )
       } catch(error) {
        console.error(error)
        return(
            <><i>{t<string>('No Date')}</i></>
        )
       }
    }

function blockAccount(_acct: string): boolean {
  const _blocked: boolean = (feedDetail.ok.blocked.find(_blk => _blk === _acct))
   ? true : false
  return(_blocked)
}    

function renderLink(_link: string): JSX.Element {
  const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
  const videoLink: string = (ilink.includes('embed')) ? ilink 
		  : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
      	  : ('https://www.youtube.com/embed/' + ilink.slice(32));

  return(
    <>
    {ilink.trim() != 'http://' ? (<>
      {(ilink).includes('youtu')? (
      <iframe width="450" height="345" src={videoLink +'?autoplay=0&mute=1'}> 
      </iframe>) : (
      <Image bordered rounded src={ilink} size='large' />
      )}    
    </>) : <>{''}</>}
    <br /></>
  )
}

function ShowFeed(): JSX.Element {
      setCountPost(0)
      const maxIndex: number = feedDetail.ok.maxfeed;
      try {
        return(
          <div>
            <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                <Button
                  icon='times'
                  label={t<string>('Close')}
                  onClick={onClear}
                />
                {t<string>(' Number of Posts: ')}<strong>{countPost}</strong>
                {t<string>(' |  Number of Posts to show: ')}<strong>{feedDetail.ok.maxfeed}</strong>
                <LabelHelp help={t<string>('Go to User Settings to change the number of Posts to show.')} />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {feedDetail.ok.blocked.length>0 && (
                  <>
                  <Badge
                  icon='info'
                  color={(isShowBlockedAccounts) ? 'blue' : 'gray'}
                  onClick={toggleShowBlockedAccounts}/> 
                  {t<string>(' Blocked: ')}<strong>{feedDetail.ok.blocked.length}</strong>
                  {isShowBlockedAccounts && (
                    <>
                    {feedDetail.ok.blocked.map(_blkd =>
                    <>{' ('}<AccountName value={_blkd} withSidebar={true}/>{') '}
                    </>)}<br />
                    </>
                  )}
                  </>)}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
                {feedDetail.ok.myfeed
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all replies
                    .filter(_subFeed => _subFeed.replyTo === zeroMessageId)
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    .sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_feed, index: number) =>
                    <>
                    {index < maxIndex && (
                    <>
                    <h3> 
                            <strong>{'@'}</strong>
                            <strong>{(isHex(_feed.username)? hexToString(_feed.username).trim() : '')}</strong>
                              {' ('}<AccountName value={_feed.fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_feed.endorserCount}</Label>
                              {' '}{timeStampToDate(_feed.timestamp)}{' '}
                              {' '}{(_feed.replyCount>0)? (
                              
                              <Label  as='a' 
                                color={(isReply && (index === feedIndex)) ? 'blue' : 'grey'}
                                onClick={() => setFeedIndex(index)}>

                                {' Replies '}{_feed.replyCount}
                              </Label>) : (
                              <Label color='grey'>{' Replies 0'}</Label>)}{t<string>(' ')}
                              <CopyInline value={_feed.messageId} label={''}/>
                     </h3>
                     {isShowEndorsers && _feed.endorserCount > 0 && (
                    <>
                    <List divided inverted >
                      {_feed.endorsers.map((name, i: number) => <List.Item key={name}> 
                        {(i > 0) && (<><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}
                        {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                        </>)}
                      </List.Item>)}
                    </List>     
                    </>
                    )}
                
                    {isShowMessageID && 
                      (<>{(_feed.replyTo != zeroMessageId)
                      ? (<><i>{'reply to: '}{_feed.replyTo}</i><br />
                           <i>{'message Id: '}{_feed.messageId}</i><br /></>) 
                      : (<><i>{'message Id: '}{_feed.messageId}</i><br /></>)}
                        </>)} 
                        <br />      
                        {renderLink(_feed.link)}
                {(_feed.link != '0x') ? (
                <>
                    {(isHex(_feed.message)? (
                              <>
                              {hexToString(_feed.message).trim()}
                              </>
                              ) :'')}{' '}

                    <Label  as='a'
                    color='orange'
                    circular
                    href={isHex(_feed.link) ? withHttp(hexToString(_feed.link).trim()) : ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{t<string>('Link')}
                    </Label>{' '}
                    {isHex(_feed.link) ? (
                        <LabelHelp help={withHttp(hexToString(_feed.link).trim())} />
                        ) : ''}</>
                    ) : (
                    <>{(isHex(_feed.message)? hexToString(_feed.message).trim() :'')}{' '}</>
                    )}
                    <br /> 
                    {isReply && index === feedIndex && ShowReplies(_feed.messageId)}
                    
                    <Divider />                        
                    </>)}
                    {setCountPost(index+1)}
              </>
            )}
             </Table.Cell>
            </Table.Row>
        </Table>
        </div>   
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

function ShowReplies(replyMessageId: string): JSX.Element {

try {
    return(
      <>
                 {feedDetail.ok.myfeed
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all blocked accts
                    //.filter(_blkFeed => feedDetail.ok.blocked.map(_blkd => _blkFeed.fromAcct != _blkd)) 
                    // filter out all replies
                    .filter(_subFeed => _subFeed.replyTo === replyMessageId)
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    .sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_replyFeed, index: number) =>
                      <>
                      {!blockAccount(_replyFeed.fromAcct) && (<>
                        <Table.Row>
                            <Table.Cell>
                              <strong>{'Reply'}{' - @'}</strong>
                              <strong>{(isHex(_replyFeed.username)? hexToString(_replyFeed.username).trim() : '')}</strong>
                              {' ('}<AccountName value={_replyFeed.fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_replyFeed.endorserCount}</Label>
                              {' '}{timeStampToDate(_replyFeed.timestamp)}{' '}
                              
                              {isReplyToReply && (
                              <>
                              {' '}{(_replyFeed.replyCount>0)? (
                                  <Label  as='a' 
                                  color='grey'
                                  onClick={() => setFeedIndex(index)}>
                                  {' Replies '}{_replyFeed.replyCount}
                                  </Label>) : (
                                  <Label color='grey'>{' Replies 0'}</Label>)}{t<string>(' ')}    
                                </>
                              )}
                              <CopyInline value={_replyFeed.messageId} label={''}/>                                
                              
                              {isShowEndorsers && _replyFeed.endorserCount > 0 && (
                                  <>
                                  <List divided inverted >
                                    {_replyFeed.endorsers.map((name, i: number) => <List.Item key={name}> 
                                    {(i > 0) && (<><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}
                                    {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                                    </>)}
                                  </List.Item>)}
                                  </List>     
                                  </>
                                  )}

                                  {isShowMessageID && 
                                  (<><br />{(_replyFeed.replyTo != zeroMessageId)
                                  ? (<><i>{'reply to: '}{_replyFeed.replyTo}</i><br />
                                  <i>{'message Id: '}{_replyFeed.messageId}</i><br /></>) 
                                  : (<><i>{'message Id: '}{_replyFeed.messageId}</i><br /></>)}
                                  </>)} 
                                  <br />      

                              {renderLink(_replyFeed.link)}
                              
                              {(_replyFeed.link != '0x') ? (
                              <>

                              {(isHex(_replyFeed.message)? (
                              <>{hexToString(_replyFeed.message).trim()}</>
                              ) :'')}{' '}
                            <Label  as='a'
                            color='orange'
                            circular
                            href={isHex(_replyFeed.link) ? withHttp(hexToString(_replyFeed.link).trim()) : ''} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >{t<string>('Link')}
                          </Label>{' '}
                          {isHex(_replyFeed.link) ? (
                            <LabelHelp help={withHttp(hexToString(_replyFeed.link).trim())} />
                            ) : ''}</>) : (
                          <>{(isHex(_replyFeed.message)? hexToString(_replyFeed.message).trim() :'')}{' '}</>
                          )}
                        <br /> 
                        </Table.Cell>
                      </Table.Row>  
                      </>)}
                      </>
                    )}                          
      </>)
} catch(e) {
  console.log(e);
    return(
      <>
      {'No Replies for this message.'}
      </>
    )
}
}
    
  return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader
        fromAcct={from}
        timeDate={when}
        />
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
