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

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ListsObj = {
    listId: string,
    owner: string,
    listName: string,
    hideFromSearch: boolean,
    description: string,
    listAccounts: string[]
  }

  type ListsDetail = {
  ok: ListsObj[]
  }
  
function MyListsDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
//    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
//    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const listsDetail: ListsDetail = Object.create(_Obj);

    const [isMakeList, toggleMakeList] = useToggle(false);
    // const [isSearchAccount, toggleSearchAccount] = useToggle(false);
    // const [_toAcct, setToAcct] = useState('');

    //const [isSendToList, setSendToList] = useState(false);
    const [isDeleteList, setDeleteList] = useState(false);
    const [isSendMsg, setSendMsg] = useState(false);

    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    //const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const _reset = useCallback(
      () => {setDeleteList(false);
             setSendMsg(false);
            },
      []
    )

    const _deleteList = useCallback(
        () => {setDeleteList(true);
               setSendMsg(false);
              },
        []
      )

      const _sendList = useCallback(
        () => {setDeleteList(false);
               setSendMsg(true);
              },
        []
      )


    function hextoHuman(_hexIn: string): string {
      return((isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '')
    }
    
    function booltoPrivate(_bool: boolean): string {
      return(_bool? t<string>('Private'): t<string>('Public'))
    }
//     function timeStampToDate(tstamp: number): JSX.Element {
//       try {
//        const event = new Date(tstamp);
//        return (
//             <><i>{event.toDateString()}{' '}
//                  {event.toLocaleTimeString()}{' '}</i></>
//         )
//       } catch(error) {
//        console.error(error)
//        return(
//            <><i>{t<string>('No Date')}</i></>
//        )
//       }
//    }

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
                  icon={isMakeList? 'minus': 'plus'}
                  label={t<string>(' Make a New List')}
                  onClick={()=> {<>{toggleMakeList()}
                                   {_reset()}
                                   </>}}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  
      
function GetLists(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t<string>(' Total Lists: ')} {listCount}               
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Lists ')} />
                <strong>{t<string>('Your Lists: ')}</strong></h3> 
                
                {listsDetail.ok.length>0 &&  
                  listsDetail.ok.map((_lists, index: number)=> <>
                  <h2><strong>{'@'}{hextoHuman(_lists.listName)}</strong>
                  {' ('}<AccountName value={_lists.owner} withSidebar={true}/>{') '}                      
                  </h2>
                  <strong>{t<string>('List ID: ')}</strong>{}
                  {_lists.listId}<br />
                  <strong>{t<string>('Description: ')}</strong>{}
                  {hextoHuman(_lists.description)}<br />
                  <strong>{t<string>('List Type: ')}</strong>
                  {booltoPrivate(_lists.hideFromSearch)}
                  <br /><br />
                <Expander 
                    className='listAccounts'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Accounts'}</Label>}>
                    {_lists.listAccounts.length>0  &&
                       _lists.listAccounts.map(_listAccounts => <>
                       {_listAccounts}
                       <IdentityIcon value={_listAccounts} />
                       {' ('}<AccountName value={_listAccounts} withSidebar={true}/>{') '}
                    </>)}
                </Expander><br /><br />
                {setListCount(index+1)}
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_lists.listId)}
                        {setListName(_lists.listName)}
                        {setCount(count + 1)}
                        {_sendList()}</>}}>{'Send to List'}
                </Label>
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_lists.listId)}
                        {setListName(_lists.listName)}
                        {setCount(count + 1)}
                        {_deleteList()}</>}}>{'Delete a List'}
                </Label>
                <br /><br />
                </>)
                }
            </Table.Cell>
          </Table.Row>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Data in your Lists')}</Card>
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
      {!isSendMsg && !isDeleteList && isMakeList && (<>
        <CallSendMessage
                callIndex={16}
                onReset={() => _reset()}
            />      
        </>)}
      {!isSendMsg && !isMakeList && isDeleteList && (<>
        <CallSendMessage
                callIndex={18}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      {isSendMsg && !isMakeList && !isDeleteList && (<>
        <CallSendMessage
                callIndex={15}
                toAcct={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      <GetLists />
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
export default React.memo(MyListsDetails);
