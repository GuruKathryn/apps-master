// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from '../shared/types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Badge, Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Divider, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import AccountHeader from '../shared/AccountHeader';
import { useToggle } from '@polkadot/react-hooks';

import CallSendMessage from './CallSendMessage';


//import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ConversationObj = {
    messageId: string,
    fromAcct: string,
    fromUsername: string,
    toAcct: string,
    message: string,
    fileHash: string,
    fileUrl: string,
    timestamp: number
  }

  type List_messagesObj = {
    messageId: string,
    fromAcct: string,
    username: string,
    toListId: string,
    toListName: string,
    message: string,
    fileHash: string,
    fileUrl: string,
    timestamp: number
  }

  type PeopleObj = {
    allowedAccount: string,
    username: string,
    conversation: ConversationObj[]
  }
  
  type GroupObj = {
    allowedList: string,
    listName: string,
    listMessages: List_messagesObj
  }

  type ListsObj = {
    allowedList: string,
    listName: string,
    listMessages: List_messagesObj[]
  }

  type InBoxObj = {
    blockedAccts: string[],
    people: PeopleObj[],
    groups: GroupObj[],
    lists: ListsObj[]
  }

  type InBoxDetail = {
  ok: InBoxObj
  }
  
function InBoxDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
//    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
//    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const inBoxDetail: InBoxDetail = Object.create(_Obj);

    const [isSearchKeyword, toggleSearchKeyword] = useToggle(false);
    const [isSearchAccount, toggleSearchAccount] = useToggle(false);

    const [_toAcct, setToAcct] = useState('');
    const [_username, setUsername] = useState('');
    const [isMessage, setMessage] = useState(false);
    const [isListMsg, setListMsg] = useState(false);

    const [count, setCount] = useState(0);
    const [countInbox, setCountInbox] = useState(0);
    const [countLists, setCountLists] = useState(0);
    const [countGroups, setCountGroups] = useState(0);



    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const _reset = useCallback(
      () => {setMessage(false);
             setListMsg(false);
            },
      []
    )
    
    const _makeMessage = useCallback(
      () => {setMessage(true);
             setListMsg(false);
            },
      []
    )

    const _makeListMsg = useCallback(
      () => {setMessage(false);
             setListMsg(true);
            },
      []
    )

    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '';
      return(_Out)
    }
    
    function blockAccount(_acct: string): boolean {
      const _blocked: boolean = ((inBoxDetail.ok.blockedAccts.length>0 ? inBoxDetail.ok.blockedAccts : []).find(_blk => _blk === _acct))
       ? true : false
      return(_blocked)
    }  

    function timeStampToDate(tstamp: number): JSX.Element {
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

  //  function renderLink(_link: string): JSX.Element {
  //   const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
  //   const videoLink: string = (ilink.includes('embed')) ? ilink 
  //       : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
  //           : ('https://www.youtube.com/embed/' + ilink.slice(32));
  
  //   return(
  //     <>
  //     {ilink.trim() != 'http://' ? (<>
  //       {(ilink).includes('youtu')? (
  //       <iframe width="450" height="345" src={videoLink +'?autoplay=0&mute=1'}> 
  //       </iframe>) : (
  //       <Image bordered rounded src={ilink} size='large' />
  //       )}    
  //     </>) : <>{''}</>}
  //     <br /></>
  //   )
  // }
  // function _renderLink(_link: string): JSX.Element {
  //   return(<>
  //          <link
  //           href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''}
  //           target="_blank" 
  //           rel="noopener noreferrer">
  //           </link>
  //   </>)
  // }

    // function autoCorrect(arr: string[], str: string): JSX.Element {
    //     arr.forEach(w => str = str.replaceAll(w, '****'));
    //     arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
    //     arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
    //     arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
    //     return (
    //     <>{t<string>(str)}</>)
    // }

    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t<string>(' Close ')}
                  onClick={onClear}
                />
              <Button
                  icon={isSearchKeyword? 'minus': 'plus'}
                  label={t<string>(' Search By Keyword ')}
                  onClick={toggleSearchKeyword}
                />
              <Button
                  icon={isSearchAccount? 'minus': 'plus'}
                  label={t<string>(' Search by Account ')}
                  onClick={toggleSearchAccount}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  

function GetMessages(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {' Total InBox: '}{countInbox}{' '}
                {' Total Lists: '}{countLists}{' '}
                {' Total Groups: '}{countGroups}{' '}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Inbox ')} />
                <strong>{t<string>(' People: ')}</strong></h3> 
          
                {inBoxDetail.ok.people.length>0 && 
                  inBoxDetail.ok.people.map((_people, inbox: number)=> <>
                  <h2><strong>{'@'}{hextoHuman(_people.username)}</strong>
                  {' ('}<AccountName value={_people.allowedAccount} withSidebar={true}/>{') '}
                  <Badge icon='envelope' color={'blue'}
                                  onClick={()=>{<>
                                  {setToAcct(_people.allowedAccount)}
                                  {setCount(count + 1)}
                                  {_makeMessage()}</>}}/>                        
                  </h2>
                  {_people.conversation.length>0 && (<>
                    <Expander 
                    className='message'
                    isOpen={false}
                    summary={<Label size={'mini'} color='orange' circular> {'View'}</Label>}>
                  {_people.conversation.length>0 &&
                    _people.conversation.map((_conversation, index: number) => <>
                      {timeStampToDate(_conversation.timestamp)}{' '}<br />
                      {_conversation.toAcct===from? (<>
                        <Label 
                          color='blue' textAlign='left' pointing= 'right'>
                          {hextoHuman(_conversation.message)}{' '}
                        </Label>
                        <IdentityIcon value={_conversation.fromAcct} />
                        {' ('}<AccountName value={_conversation.fromAcct} withSidebar={true}/>{') '}
                      </>): (<>
                        <IdentityIcon value={_conversation.fromAcct} />
                        {' ('}<AccountName value={_conversation.fromAcct} withSidebar={true}/>{') '}
                        <Label  color='grey' textAlign='left' pointing='left'>
                          {hextoHuman(_conversation.message)}{' '}
                        </Label>
                      </>)}
                      {(_conversation.fileUrl != '0x') && (
                      <>
                        <Label  as='a' color='orange' circular size={'mini'}
                        href={isHex(_conversation.fileUrl) ? withHttp(hexToString(_conversation.fileUrl).trim()) : ''} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >{t<string>('Link')}
                        </Label>{' '}
                      </>)}                     
                      <br /><br />
                    </>)}
                   </Expander>
                   
                  {setCountInbox(inbox+1)}
                  </>)}
                  <Divider />
                </>)
                }
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Lists ')} />
                <strong>{t<string>(' Lists: ')}</strong></h3> 
                {inBoxDetail.ok.lists.length>0 &&
                 inBoxDetail.ok.lists.map((_lists, index: number) =>
                <>
                  <h2>{_lists.listName && <>
                    <strong>{'@'}{hextoHuman(_lists.listName)}{' '}</strong></>}
                  
                    <Badge icon='envelope' color={'blue'}
                                  onClick={()=>{<>
                                  {setToAcct(_lists.allowedList)}
                                  {setUsername(_lists.listName)}
                                  {setCount(count + 1)}
                                  {_makeListMsg()}</>}}/>                  
                  
                  </h2>  
                  {_lists.listMessages.length>0 && (<>
                    <Expander 
                    className='listMessage'
                    isOpen={false}
                    summary={<Label size={'mini'} color='orange' circular> {'Messages'}</Label>}>
                    
                    {_lists.listMessages.map((_message, iLists: number) => <>
                      {timeStampToDate(_message.timestamp)}<br />
                      <IdentityIcon value={_message.fromAcct} />
                      {' ('}<AccountName value={_message.fromAcct} withSidebar={true}/>{') '}
                      {hextoHuman(_message.username)}
                      <Label color='blue' textAlign='left' pointing='left'>
                          {hextoHuman(_message.message)}
                      </Label>
                      {(_message.fileUrl != '0x') && (
                      <>
                        <Label  as='a' color='orange' circular size={'mini'}
                        href={isHex(_message.fileUrl) ? withHttp(hexToString(_message.fileUrl).trim()) : ''} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >{t<string>('Link')}
                        </Label>{' '}
                      </>)} <br /><br />
                    </>)}
                  </Expander>
                  
                  </>)}       
                  {setCountLists(index+1)}   
                  <Divider />         
                </>)
                }
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Groups ')} />
                <strong>{t<string>(' Groups: ')}</strong></h3> 
            </Table.Cell>
          </Table.Row>

      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Data in your InBox')}</Card>
        </div>
      )
    }
}
    

  return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={2}/>
      <ListAccount />
      <GetMessages />
      {isMessage && (<>
        <CallSendMessage
                callIndex={1}
                toAcct={_toAcct}
                onReset={() => _reset()}
            />      
        </>)}
        {isListMsg && (<>
        <CallSendMessage
                callIndex={15}
                toAcct={_toAcct}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
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
export default React.memo(InBoxDetails);
