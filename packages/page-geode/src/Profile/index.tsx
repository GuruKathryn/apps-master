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
  
export default function Profile ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    const [isUpdate, toggleUpdate] = useToggle();
    const [isLookUp, toggleLookUp] = useToggle();
    const [isSearch, toggleSearch] = useToggle();
    const [isByAccount, toggleByAccount] = useToggle();
    const [isByKeyword, toggleByKeyword] = useToggle();
    const refTitle: string[] = 
    [' Create your Profile. (Click again to close) ', 
     ' Lookup an account and display its profile. (Click again to close) ', 
     ' Search for Profiles by Keyword or by Account. ',
     ' Search by Account, Enter Account Public Key below. (Click again to close) ',
     ' Search by Keyword, Enter a Keyword to search all available Public Profiles.'];
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);
    // const [codeHash, setCodeHash] = useState<string | undefined>();
    // const [constructorIndex, setConstructorIndex] = useState(0);
    // const [isDeployOpen, toggleDeploy, setIsDeployOpen] = useToggle();

    // const _onShowDeploy = useCallback(
    //   (codeHash: string, constructorIndex: number): void => {
    //     setCodeHash(codeHash || (allCodes && allCodes[0] ? allCodes[0].json.codeHash : undefined));
    //     setConstructorIndex(constructorIndex);
    //     toggleDeploy();
    //   },
    //   [allCodes, toggleDeploy]
    // );
    
    // const _onCloseDeploy = useCallback(
    //   () => setIsDeployOpen(false),
    //   [setIsDeployOpen]
    // );
    
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
        {!isByKeyword && !isByAccount && !isLookUp && !isSearch && (
        <><Button
                icon={(isUpdate) ? 'minus' : 'plus'}
                label={t<string>('Create Your Profile')}
                onClick={toggleUpdate}>
          </Button>
          </>
        )}
        {!isByKeyword && !isByAccount && !isUpdate && !isSearch && (
          <>
              <Button
                icon={(isLookUp) ? 'minus' : 'plus'}
                label={t('Account Lookup')}
                onClick={toggleLookUp}>
              </Button>    
          </>
        )}
        {!isByKeyword && !isByAccount && !isUpdate && !isLookUp && (
          <>
          <Button
            icon={(isSearch) ? 'minus' : 'plus'}
            label={t('Search')}
            onClick={toggleSearch}>
          </Button>    
          </>
        )}
        {isUpdate && (<>{refTitle[0]}</>)}
        {isLookUp && (<>{refTitle[1]}</>)}
        {isSearch && (<>{refTitle[2]}</>)}
        </Card>                     
        {isSearch && (
        <>
          <Card>
          {!isByKeyword && (
            <>
              <Button
                icon={(isByAccount) ? 'minus' : 'plus'}
                label={t('By Account')}
                onClick={toggleByAccount}>
              </Button>    
            </>
          )}
          {!isByAccount && (
            <>
            <Button
              icon={(isByKeyword) ? 'minus' : 'plus'}
              label={t('By Keyword')}
              onClick={toggleByKeyword}>
            </Button>    
            </>
          )}
          {isByAccount && (<>{refTitle[0]}</>)}
          {isByKeyword && (<>{refTitle[1]}</>)}
          </Card>
        </>
        )}
        </Table>
        {isUpdate && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={0}
        />)}
        {isLookUp && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={1}
        />)}
        {isByAccount && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={3}
        />)}
        {isByKeyword && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={2}
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
