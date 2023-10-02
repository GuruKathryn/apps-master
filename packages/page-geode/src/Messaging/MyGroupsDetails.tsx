// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from '../shared/types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import AccountHeader from '../shared/AccountHeader';
import { useToggle } from '@polkadot/react-hooks';

import CallSendMessage from './CallSendMessage';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type GroupObj = {
    groupId: string,
    groupName: string,
    hideFromSearch: boolean,
    description: string,
    groupAccounts: string[]
  }

  type ListsDetail = {
  ok: GroupObj[]
  }
  
function MyGroupsDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const groupsDetail: ListsDetail = Object.create(_Obj);

    const [isMake, toggleMake] = useToggle(false);
    const [isSendGroup, setSendGroup] = useState(false);
    const [isDeleteSent, setDeleteSent] = useState(false);
    const [isUpdateGroup, setUpdateGroup] = useState(false);
    const [isleaveGroup, setLeaveGroup] = useState(false);

    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [groupCount, setGroupCount] = useState(0);

    const _reset = useCallback(
      () => { setSendGroup(false);
              setDeleteSent(false);
              setUpdateGroup(false);
              setLeaveGroup(false);
            },
      []
    )

    const _sendGroup = useCallback(
        () => { setSendGroup(true);
                setDeleteSent(false);
                setUpdateGroup(false);
                setLeaveGroup(false);
              },
        []
      )

      const _deleteSent = useCallback(
        () => { setSendGroup(false);
                setDeleteSent(true);
                setUpdateGroup(false);
                setLeaveGroup(false);
              },
        []
      )

      const _updateGroup = useCallback(
        () => { setSendGroup(false);
                setDeleteSent(false);
                setUpdateGroup(true);
                setLeaveGroup(false);
              },
        []
      )

      const _leaveGroup = useCallback(
        () => { setSendGroup(false);
                setDeleteSent(false);
                setUpdateGroup(false);
                setLeaveGroup(true);
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
              <Button
                  icon={isMake? 'minus': 'plus'}
                  label={t<string>(' Make a Group')}
                  onClick={()=> {<>{toggleMake()}
                                   {_reset()}
                                   </>}}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  
      
function GetGroups(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t<string>(' Total Groups: ')} {groupCount}               
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Groups ')} />
                <strong>{t<string>('Your Groups: ')}</strong></h3> 
                
                {groupsDetail.ok.length>0 &&  
                  groupsDetail.ok.map((_groups, index: number)=> <>
                  <h2><strong>{'@'}{hextoHuman(_groups.groupName)}</strong>                    
                  </h2>
                  <strong>{t<string>('Group ID: ')}</strong>{}
                  {_groups.groupId}{' '}
                  <CopyInline value={_groups.groupId} label={''}/><br />
                  <strong>{t<string>('Description: ')}</strong>{}
                  {hextoHuman(_groups.description)}<br />
                  <strong>{t<string>('Group Type: ')}</strong>
                  {booltoPrivate(_groups.hideFromSearch)}
                  <br /><br />
                <Expander 
                    className='listAccounts'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Accounts'}</Label>}>
                    {_groups.groupAccounts.length>0  &&
                       _groups.groupAccounts.map(_groupAccounts => <>
                       {_groupAccounts}
                       <IdentityIcon value={_groupAccounts} />
                       {' ('}<AccountName value={_groupAccounts} withSidebar={true}/>{') '}
                    </>)}
                </Expander><br /><br />
                {setGroupCount(index+1)}
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_groups.groupId)}
                        {setListName(_groups.groupName)}
                        {setCount(count + 1)}
                        {_sendGroup()}</>}}>{t('Send to Group')}
                </Label>
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_groups.groupId)}
                        {setListName(_groups.groupName)}
                        {setCount(count + 1)}
                        {_deleteSent()}</>}}>{t('Delete Sent')}
                </Label>
                {from===_groups.groupAccounts[0] && 
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_groups.groupId)}
                        {setListName(_groups.groupName)}
                        {setCount(count + 1)}
                        {_updateGroup()}</>}}>{t('Update Group')}
                </Label>
                }
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_groups.groupId)}
                        {setListName(_groups.groupName)}
                        {setCount(count + 1)}
                        {_leaveGroup()}</>}}>{t('Leave Group')}
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
      {!isSendGroup && !isDeleteSent && !isUpdateGroup && !isleaveGroup && isMake && (<>
        <CallSendMessage
                callIndex={9}
                onReset={() => _reset()}
            />      
        </>)}
      {!isDeleteSent && !isUpdateGroup && !isleaveGroup && !isMake && isSendGroup && (<>
        <CallSendMessage
                callIndex={2}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      {isDeleteSent && !isUpdateGroup && !isleaveGroup && !isMake && !isSendGroup && (<>
        <CallSendMessage
                callIndex={11}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      {!isDeleteSent && isUpdateGroup && !isleaveGroup && !isMake && !isSendGroup && (<>
        <CallSendMessage
                callIndex={14}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      {!isDeleteSent && !isUpdateGroup && isleaveGroup && !isMake && !isSendGroup && (<>
        <CallSendMessage
                callIndex={13}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      <GetGroups />
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
export default React.memo(MyGroupsDetails);
