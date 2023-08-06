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
import SearchDetails from '../Profile/SearchDetails';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ListObj = {
    listId: string,
    owner: string,
    listName: string,
    hideFromSearch: boolean,
    description: string,
    listAccounts: string[]
  }

  type SearchObj = {
    search: string;
    lists: ListObj[];
  }

  type SearchDetail = {
  ok: SearchObj;
  }
  
function FindListsDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
//    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
//    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const searchDetail: SearchDetail = Object.create(_Obj);

    //const [isJoinList, toggleJoinList] = useToggle(false);
    // const [isSearchAccount, toggleSearchAccount] = useToggle(false);
    // const [_toAcct, setToAcct] = useState('');

    const [isJoinList, setJoinList] = useState(false);
    const [isUnsubscribe, setUnsubscribe] = useState(false);
    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    //const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const _reset = useCallback(
      () => {setJoinList(false);
             setUnsubscribe(false);
            },
      []
    )

    const _joinList = useCallback(
        () => {setJoinList(true);
               setUnsubscribe(false);
              },
        []
      )

      const _unsubscribe = useCallback(
        () => {setJoinList(false);
               setUnsubscribe(true);
              },
        []
      )


    function hextoHuman(_hexIn: string): string {
      return((isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '')
    }
    
    function booltoPrivate(_bool: boolean): string {
      return(_bool? t<string>('Private'): t<string>('Public'))
    }

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
                {searchDetail.ok.search!='0x' && (<>
                    {t<string>('Search Results for: ')}
                    {hextoHuman(searchDetail.ok.search)} {' '}{' | '}{' '}
                </>)}
                {t<string>(' Total Number of Lists: ')} {listCount} {' '}    
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Lists ')} />
                <strong>{t<string>('Your Lists: ')}</strong></h3> 
                {searchDetail.ok.lists.length>0 &&  
                  searchDetail.ok.lists.map((_lists, index: number)=> <>
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
                {setListCount(index+1)}
                <Label color='orange' as='a'
                       onClick={()=>{<>
                         {setListId(_lists.listId)}
                         {setListName(_lists.listName)}
                         {setCount(count + 1)}
                         {_joinList()}</>}}
                >{'Join List'}
                </Label>
                <Label color='orange' as='a'
                       onClick={()=>{<>
                         {setListId(_lists.listId)}
                         {setListName(_lists.listName)}
                         {setCount(count + 1)}
                         {_unsubscribe()}</>}}
                >{'Unsubscribe'}
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
      {!isUnsubscribe && isJoinList && (<>
        <CallSendMessage
                callIndex={19}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
            />      
        </>)}
        {isUnsubscribe && !isJoinList && (<>
        <CallSendMessage
                callIndex={20}
                messageId={_listId}
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
export default React.memo(FindListsDetails);
