// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useCallback, useState } from 'react';

import styled from 'styled-components';

import { Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../translate';
import { useCodes } from '../useCodes';
import { useContracts } from '../useContracts';

import ContractsTable from './ContractsTable';

import Summary from './Summary';
//import Details from './Details';

interface Props {
    className?: string;
  }
  
export default function Messaging ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    // main_menus
    const [isInBox, toggleInBox] = useToggle();
    const [isPaidInBox, togglePaidInBox] = useToggle();
    const [isUpdate, toggleUpdate] = useToggle();
    const [isAllowedAccount, toggleAllowedAccount] = useToggle();
    const [isMyGroup, toggleMyGroup] = useToggle();
    const [isLists, toggleLists] = useToggle();
    // sub_menus_Inbox
    const [isSearchKeyword, toggleSearchKeyword] = useToggle();
    const [isSearchAccount, toggleSearchAccount] = useToggle();
    // sub_menu_Paid_Inbox
    const [isBlockList, toggleBlockList] = useToggle();
    const [isUnBlockList, toggleUnBlockList] = useToggle();
    // sub_menu_Allowed_Account
    const [isAddAcct, toggleAddAcct] = useToggle();
    const [isRemoveAcct, toggleRemoveAcct] = useToggle();
    const [isBlockAcct, toggleBlockAcct] = useToggle();
    const [isUnBlockAcct, toggleUnBlockAcct] = useToggle();
    const [isDeleteMsg, toggleDeleteMsg] = useToggle();
    const deployApp: boolean = false;


    const refTitle: string[] = 
    [' Load Your Inbox. Search by Keyword or Account. (Click again to close) ', 
     ' Load Your Paid Inbox. Block or Unblock Lists. (Click again to close) ', 
     ' Update your User Settings for Private Messaging. ',
     ' Add, Remove, Block or Unblock Accounts as well as Delete Messages. (Click again to close) ',
     ' Manage Your Message Groups. Find, Make, Join Public and Private Groups. ',
     ' Manage Your Lists. Make, Join, Send or Delete Your Lists or PAID Lists. '];
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);
    
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
            {!deployApp && (<><strong>{'Coming Soon!'}</strong></>)}

        {deployApp && !isLists && !isMyGroup && !isAllowedAccount && !isPaidInBox && !isUpdate && (
        <><Button
                icon={(isInBox) ? 'minus' : 'plus'}
                label={t<string>('Inbox')}
                onClick={toggleInBox}>
          </Button>
          </>
        )}
        {deployApp && !isLists && !isMyGroup && !isAllowedAccount && !isInBox && !isUpdate && (
          <>
              <Button
                icon={(isPaidInBox) ? 'minus' : 'plus'}
                label={t('PAID Inbox')}
                onClick={togglePaidInBox}>
              </Button>    
          </>
        )}
        {deployApp && !isLists && !isMyGroup && !isAllowedAccount && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isUpdate) ? 'minus' : 'plus'}
            label={t('Update Settings')}
            onClick={toggleUpdate}>
          </Button>    
          </>
        )}
        {deployApp && !isLists && !isUpdate && !isMyGroup && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isAllowedAccount) ? 'minus' : 'plus'}
            label={t('Allowed Accounts')}
            onClick={toggleAllowedAccount}>
          </Button>    
          </>
        )}

        {deployApp && !isLists && !isUpdate && !isAllowedAccount && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isMyGroup) ? 'minus' : 'plus'}
            label={t('My Groups')}
            onClick={toggleMyGroup}>
          </Button>    
          </>
        )}

        {deployApp && !isUpdate && !isMyGroup && !isAllowedAccount && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isLists) ? 'minus' : 'plus'}
            label={t('Lists')}
            onClick={toggleLists}>
          </Button>    
          </>
        )}
        {isInBox && (<>{refTitle[0]}</>)}
        {isPaidInBox && (<>{refTitle[1]}</>)}
        {isUpdate && (<>{refTitle[2]}</>)}
        {isAllowedAccount && (<>{refTitle[3]}</>)}
        {isMyGroup && (<>{refTitle[4]}</>)}
        {isLists && (<>{refTitle[5]}</>)}
        </Card>                     
        {isInBox && (
          <>
          <Card>
          <Button
            icon={(isSearchKeyword) ? 'minus' : 'plus'}
            label={t('Search Inbox By Keyword')}
            onClick={toggleSearchKeyword}>
          </Button>    
          <Button
            icon={(isSearchAccount) ? 'minus' : 'plus'}
            label={t('Search Inbox By Account')}
            onClick={toggleSearchAccount}>
          </Button>    
          </Card>
          </>
        )}
        {isPaidInBox && (
          <>
          <Card>
          <Button
            icon={(isBlockList) ? 'minus' : 'plus'}
            label={t('Block a List')}
            onClick={toggleBlockList}>
          </Button>    
          <Button
            icon={(isUnBlockList) ? 'minus' : 'plus'}
            label={t('Unblock a List')}
            onClick={toggleUnBlockList}>
          </Button>    
          </Card>
          </>
        )}
        {isAllowedAccount && (
          <>
          <Card>
          <Button
            icon={(isAddAcct) ? 'minus' : 'plus'}
            label={t('Add')}
            onClick={toggleAddAcct}>
          </Button>    
          <Button
            icon={(isRemoveAcct) ? 'minus' : 'plus'}
            label={t('Remove')}
            onClick={toggleRemoveAcct}>
          </Button>    
          <Button
            icon={(isBlockAcct) ? 'minus' : 'plus'}
            label={t('Block')}
            onClick={toggleBlockAcct}>
          </Button>    
          <Button
            icon={(isUnBlockAcct) ? 'minus' : 'plus'}
            label={t('UnBlock')}
            onClick={toggleUnBlockAcct}>
          </Button>    
          <Button
            icon={(isDeleteMsg) ? 'minus' : 'plus'}
            label={t('Delete Message')}
            onClick={toggleDeleteMsg}>
          </Button>    
          </Card>
          </>
        )}
        </Table>
        {isInBox && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={0}
        />)}
        {isPaidInBox && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={1}
        />)}


    </div>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;
