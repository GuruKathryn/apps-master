// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
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

//   type FeedObj = {
//     messageList: MessageObj[],
//   }
  
  type FeedDetail = {
  ok: MessageObj[]
  }

  // type ProfileSearchIndex = {
  // index: number
  // }

  
function KeywordDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    //const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const maxIndex = 25;
    const isReply: boolean = true;
    const isReplyToReply: boolean = false;

    //const [isShowFollowers, toggleShowFollowers] = useToggle(false);
    //const [isShowFollowing, toggleShowFollowing] = useToggle(false);
    const [isShowEndorsers, toggleShowEndorse] = useToggle(false);
    const [isShowMessageID, toggleShowMsgId] = useToggle(false);

    const [feedIndex, setFeedIndex] = useState(0);
    const [countPost, setCountPost] = useState(0);

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

// function blockAccount(_acct: string): boolean {
//  const _blocked: boolean = (feedDetail.ok.blocked.find(_blk => _blk === _acct))
//   ? true : false
//  return(_blocked)
// }    

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

function ListAccount(): JSX.Element {
  try {
    return (
      <div>
        <Table>
          <Table.Row>
          <Table.Cell>
            </Table.Cell>
            <Table.Cell>
            <IdentityIcon value={from} />
            <AccountName value={from} withSidebar={true}/>
            <LabelHelp help={t<string>(' The account calling the information.')} /> 
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
            {t<string>(' No. of Endorsements: ')}
            <Label circular color='blue'>{'#'}</Label>  
            {t<string>(' See Replies: ')}
            <Label color='blue'>{'Reply'}</Label>  
            {t<string>(' Copy Message ID: ')}
            <CopyInline value={' '} label={''}/>
            </Table.Cell>
            <Table.Cell>
            <Button
              icon='times'
              label={t<string>('Close')}
              onClick={onClear}
            />
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
          <strong>{t<string>('There are no posts available.')}</strong>
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
      
      return(
        <div>
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                  <LabelHelp help={t<string>(' Search result ')} /> 
              {' '}
              <Badge
                icon={(isShowEndorsers) ? 'thumbs-up' : 'thumbs-down'}
                color={(isShowEndorsers) ? 'blue' : 'gray'}
                onClick={toggleShowEndorse}/> 
                {' Show Endorsers | '}
                <Badge
                icon={(isShowMessageID) ? 'thumbs-up' : 'thumbs-down'}
                color={(isShowMessageID) ? 'blue' : 'gray'}
                onClick={toggleShowMsgId}/> 
                {' Show Message IDs | '}
                {t<string>('Number of Posts: ')}<strong>{countPost}</strong>
              </Table.HeaderCell>
              </Table.Row>
          </Table.Header>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              {feedDetail.ok
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
                  {setCountPost(index+1)}
                  <Divider />                        
                  </>)}
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
                   {feedDetail.ok
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
export default React.memo(KeywordDetails);
