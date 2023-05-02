// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Badge, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Divider, List, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle } from '@polkadot/react-hooks';
import AccountHeader from '../shared/AccountHeader';

import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
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
    search: string,
    messageList: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }

  
function KeywordDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    //const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const maxIndex = 25;
    const isReply: boolean = true;
    const isReplyToReply: boolean = false;

    const [isShowEndorsers, toggleShowEndorse] = useToggle(false);
    const [isShowMessageID, toggleShowMsgId] = useToggle(false);

    const [feedIndex, setFeedIndex] = useState(0);
    const [countPost, setCountPost] = useState(0);
    const [pgIndex, setPgIndex] = useState(1);

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
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
  
    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): ''
      return(_Out)
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
function PagePager(): JSX.Element {
  const currPgIndex: number = (pgIndex > 0) ? pgIndex : (pgIndex < countPost) ? pgIndex : countPost;
  const _indexer: number = maxIndex;
  return(
    <div>
      {countPost>0 && (<>
      <Table>
        <Table.Row>
          <Table.Cell>
           <Button icon={'minus'} 
            label={t<string>('Prev Page')}
            isDisabled={currPgIndex===1}
            onClick={()=> setPgIndex((currPgIndex-_indexer)>0 ? currPgIndex-_indexer : 1)}/>
           <Button icon={'plus'} 
            label={t<string>('Next Page')}
            isDisabled={currPgIndex>countPost}
            onClick={()=> setPgIndex(currPgIndex<countPost-1 ? currPgIndex+_indexer : countPost)}/>
           <LabelHelp help={t<string>(' Use these buttons to page through your Posts.')} /> 
          </Table.Cell>
        </Table.Row>
      </Table>
      </>)}
    </div>
  )
 }


function PageIndexer(): JSX.Element {
  const currPgIndex: number = (pgIndex > 0) ? pgIndex : (pgIndex < countPost) ? pgIndex : countPost;
  const _indexer: number = 1;
  return (
    <div>
      <Table>
        <Table.Row>
          <Table.Cell>
          <Button
            icon='times'
            label={t<string>('Close')}
            onClick={onClear}
          />
           <Button icon={'home'} 
           isDisabled={currPgIndex===0}
           onClick={()=> setPgIndex(1)}/>
           <Button icon={'minus'} 
           isDisabled={countPost===0}
            onClick={()=> setPgIndex((currPgIndex-_indexer)>0 ? currPgIndex-_indexer : 1)}/>
           <Button icon={'plus'} 
           isDisabled={countPost===0}
            onClick={()=> setPgIndex(currPgIndex<countPost-1 ? currPgIndex+_indexer : countPost)}/>
           <Button icon={'sign-in-alt'}
           isDisabled={countPost===0}
           onClick={()=> setPgIndex((countPost>0)? countPost: 1)}/>
           <strong>{t<string>(' | Showing Post: ')}{pgIndex<countPost? pgIndex: countPost}{' thru '}{
           (pgIndex+maxIndex) < countPost? pgIndex+maxIndex: countPost}</strong>
           <LabelHelp help={t<string>(' Use these buttons to page through your Posts.')} /> 
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
  )
 }

  function ShowSearchResults(): JSX.Element {
    try {
    
      return(
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
              <h2>{t<string>('Number of Posts Found: ')}<strong>{countPost}</strong>
                  {t<string>(' for Search Word: ')}
                  {feedDetail.ok.search.length>0 && (<>
                    <strong>{hextoHuman(feedDetail.ok.search)}</strong>                  
                  </>)}</h2>
              {' '}
              <Badge
                icon={(isShowEndorsers) ? 'thumbs-up' : 'thumbs-down'}
                color={(isShowEndorsers) ? 'blue' : 'gray'}
                onClick={toggleShowEndorse}/> 
                {t<string>(' Show Endorsers | ')}
                <Badge
                icon={(isShowMessageID) ? 'thumbs-up' : 'thumbs-down'}
                color={(isShowMessageID) ? 'blue' : 'gray'}
                onClick={toggleShowMsgId}/> 
                {t<string>(' Show Message IDs | ')}
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>)
    }catch(e){
      console.log(e)
      return(
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
                <strong>{t<string>('No keyword results found')}</strong>      
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>)
    }
  }
  function ShowFeed(): JSX.Element {
    try {
      setCountPost(0)
      return(
        <div>
          <div>
          <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              {feedDetail.ok.messageList.length> 0 && feedDetail.ok.messageList
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
                  {index >= pgIndex -1 && index < pgIndex + maxIndex && (
                  <>
                  <h3> 
                          <Label color='blue' circular>{'Post '}{index+1}</Label>                   
                          <strong>{t<string>('@')}</strong>
                          <strong>{hextoHuman(_feed.username)}</strong>
                            {' ('}<AccountName value={_feed.fromAcct} withSidebar={true}/>{') '}
                            {' '}<Label color='blue' circular>{_feed.endorserCount}</Label>
                            {' '}{timeStampToDate(_feed.timestamp)}{' '}
                            {' '}{(_feed.replyCount>0)? (
                            <Label  as='a' 
                              color={(isReply && (index === feedIndex)) ? 'blue' : 'grey'}
                              onClick={() => setFeedIndex(index)}>

                              {t<string>(' Replies ')}{_feed.replyCount}
                            </Label>) : (
                            <Label color='grey'>{' Replies 0'}</Label>)}{t<string>(' ')}
                            <CopyInline value={_feed.messageId} label={''}/>
                   </h3>
                   {isShowEndorsers && _feed.endorserCount > 0 && (
                  <>
                  <List divided inverted >
                    {_feed.endorsers.length && _feed.endorsers.map((name, i: number) => <List.Item key={name}> 
                      {(i > 0) && (<><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}
                      {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                      </>)}
                    </List.Item>)}
                  </List>     
                  </>
                  )}
              
                  {isShowMessageID && 
                    (<>{(_feed.replyTo != zeroMessageId)
                    ? (<><i>{t<string>('reply to: ')}{_feed.replyTo}</i><br />
                         <i>{t<string>('message Id: ')}{_feed.messageId}</i><br /></>) 
                    : (<><i>{t<string>('message Id: ')}{_feed.messageId}</i><br /></>)}
                      </>)} 
                      <br />      
                      {renderLink(_feed.link)}
              {(_feed.link != '0x') ? (
                <>{autoCorrect(searchWords, hextoHuman(_feed.message))}{' '}
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
                  <>{autoCorrect(searchWords, hextoHuman(_feed.message))}{' '}</>
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
                   {feedDetail.ok.messageList.length>0 && feedDetail.ok.messageList
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
                                      {_replyFeed.endorsers.length>0 && _replyFeed.endorsers.map((name, i: number) => <List.Item key={name}> 
                                      {(i > 0) && (<><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}
                                      {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                                      </>)}
                                    </List.Item>)}
                                    </List>     
                                    </>
                                    )}
  
                                    {isShowMessageID && 
                                    (<><br />{(_replyFeed.replyTo != zeroMessageId)
                                    ? (<><i>{t<string>('reply to: ')}{_replyFeed.replyTo}</i><br />
                                    <i>{t<string>('message Id: ')}{_replyFeed.messageId}</i><br /></>) 
                                    : (<><i>{t<string>('message Id: ')}{_replyFeed.messageId}</i><br /></>)}
                                    </>)} 
                                    <br />      
  
                                {renderLink(_replyFeed.link)}
                                
                                {(_replyFeed.link != '0x') ? (
                                <>
                                  {autoCorrect(searchWords, hextoHuman(_replyFeed.message))}
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
                            <>{autoCorrect(searchWords, hextoHuman(_replyFeed.message))}{' '}</>
                            )}
                          <br /> 
                          </Table.Cell>
                        </Table.Row>  
                        </>
                      )}                          
        </>)
  } catch(e) {
    console.log(e);
      return(
        <>
        {t<string>('No Replies for this message.')}
        </>
      )
  }
  }
  
return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader fromAcct={from} timeDate={when} />
    <ShowSearchResults />
    <PageIndexer />
    <ShowFeed />
    <PagePager />
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
export default React.memo(KeywordDetails);
