// Copyright 2017-2023 @polkadot/app-reporting authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Button, AccountName, Card } from '@polkadot/react-components';
import { Table, Label } from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage';
import { useToggle, useDebounce } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

type EntityObj = {
  userAcct: string,
  name: string,
  organization: string,
  phone: string,
  email: string,
}

type Entity = {
  delegates: EntityObj[],
  entities: EntityObj[],
}

type EntityDetail = {
  ok: Entity
}



function ViewAllowedDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const objOutput: string = stringify(output);
  const _Obj = JSON.parse(objOutput);
  const entityDetail: EntityDetail = Object.create(_Obj);
  
  // useStates for one-click buttons, and any params they pass
  const [isRemoveDelegate, setRemoveDelegate] = useState(false);
  const [isRemoveEntity, setRemoveEntity] = useState(false);
  const [removeAccountID, setRemoveAccountID] = useState('');
  
  // useToggles for secondary buttons on this display
  const [isAddDelegate, toggleAddDelegate] = useToggle(false);
  const [isAddEntity, toggleAddEntity] = useToggle(false);

  const [count, setCount] = useState(0);
    
  const _reset = useCallback(
    () => {setRemoveDelegate(false);
           setRemoveEntity(false);
          },
    []
  )
  
  const _removeDelegate = useCallback(
    () => {setRemoveDelegate(true);
          setRemoveEntity(false);
          },
    []
  )

  const _removeEntity = useCallback(
    () => {setRemoveDelegate(false);
      setRemoveEntity(true);
          },
    []
  )

  function ShowSubMenus(): JSX.Element {
    return(
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
                {/* <Button
                  icon='times'
                  label={t<string>('Close')}
                  onClick={onClear}
                /> */}
                <Button
                  icon={isAddDelegate? 'minus': 'plus'}
                  label={t<string>('Add A Delegate')}
                  isDisabled={isAddEntity}
                  onClick={()=> {<>{toggleAddDelegate()}{_reset()}</>}}
                />
                <Button
                  icon={isAddEntity? 'minus': 'plus'}
                  label={t<string>('Add Law Enforcement')}
                  isDisabled={isAddDelegate}
                  onClick={()=> {<>{toggleAddEntity()}{_reset()}</>}}
                />
             </Table.Cell>
            </Table.Row>
          </Table>
        </div>
  )}

  function ShowEntities(): JSX.Element {
    try {
      return(
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              <h3><strong>{t<string>(' Geode Legal Team Delegates: ')}</strong></h3>
              <br />
              {entityDetail.ok.delegates.map((_delegates, index: number) =>  
                <div>
                  <strong>{t<string>(' Name: ')}</strong>
                  {isHex(_delegates.name) ? hexToString(_delegates.name) : ' '}
                  <br /><strong>{t<string>(' Account: ')}</strong>
                  <><AccountName value={_delegates.userAcct} withSidebar={true}/></>
                  <br /><strong>{t<string>(' Organization: ')}</strong>
                  <>{isHex(_delegates.organization) ? hexToString(_delegates.organization) : ' '}</>
                  <br /><strong>{t<string>(' Phone: ')}</strong>
                  <>{isHex(_delegates.phone) ? hexToString(_delegates.phone) : ' '}</>
                  <br /><strong>{t<string>(' Email: ')}</strong>
                  <>{isHex(_delegates.email) ? hexToString(_delegates.email) : ' '}</>
                  <br />
                  <Label as='a' 
                        circular
                        color='orange'
                        onClick={()=>{<>
                          {setRemoveAccountID(_delegates.userAcct)}
                          {setCount(count + 1)}
                          {_removeDelegate()}</>}}
                        >{'Remove'}</Label>
                  <br /><br />
              </div>
              )} 
            </Table.Cell>
          </Table.Row>
        </Table>
        
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              <h3><strong>{t<string>(' Allowed Law Enforcement Entities: ')}</strong></h3>
              <br />
              {entityDetail.ok.entities.map((_entities, index: number) =>  
              <div>
                <strong>{t<string>(' Name: ')}</strong>
                <>{isHex(_entities.name) ? hexToString(_entities.name) : ' '}</>
                <br /><strong>{t<string>(' Account: ')}</strong>
                <><AccountName value={_entities.userAcct} withSidebar={true}/></>
                <br /><strong>{t<string>(' Organization: ')}</strong>
                <>{isHex(_entities.organization) ? hexToString(_entities.organization) : ' '}</>
                <br /><strong>{t<string>(' Phone: ')}</strong>
                <>{isHex(_entities.phone) ? hexToString(_entities.phone) : ' '}</>
                <br /><strong>{t<string>(' Email: ')}</strong>
                <>{isHex(_entities.email) ? hexToString(_entities.email) : ' '}</>
                <br />
                  <Label as='a' 
                        circular
                        color='orange'
                        onClick={()=>{<>
                          {setRemoveAccountID(_entities.userAcct)}
                          {setCount(count + 1)}
                          {_removeEntity()}</>}}
                        >{'Remove'}</Label>
                  <br /><br />
              </div>
              )}
            </Table.Cell>
          </Table.Row>
        </Table>
        </div>
        </div> 
      )

    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('Nothing To Show')}</Card>
        </div>
      )
    }
  }

  return (
    <StyledDiv className={className}>
    <Card>
      <ShowSubMenus />
      {isAddDelegate && !isAddEntity && !isRemoveDelegate && !isRemoveEntity &&  (
        <CallSendMessage
          callIndex={2}
          onClear={() => _reset()}
        />
      )}
      {!isAddDelegate && isAddEntity && !isRemoveDelegate && !isRemoveEntity &&  (
        <CallSendMessage
          callIndex={4}
          onClear={() => _reset()}
        />
      )}
      <ShowEntities />
      {!isAddDelegate && !isAddEntity && isRemoveDelegate && !isRemoveEntity && (
        <CallSendMessage 
          removeAccountID={removeAccountID}
          callIndex={3}
          onClear={() => _reset()}
        />
      )}
      {!isAddDelegate && !isAddEntity && !isRemoveDelegate && isRemoveEntity && (
        <CallSendMessage 
          removeAccountID={removeAccountID}
          callIndex={5}
          onClear={() => _reset()}
        />
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

export default React.memo(ViewAllowedDetails);
