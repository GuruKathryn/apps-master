// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Card, Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

//import Codes from '../Codes';
import CodeAdd from '../Codes/Add';
import CodeUpload from '../Codes/Upload';
import { useTranslation } from '../translate';
import { useCodes } from '../useCodes';
import { useContracts } from '../useContracts';
import ContractAdd from './Add';
import ContractsTable from './ContractsTable';
import ClaimType from './ClaimType';

import Summary from './Summary';

interface Props {
  className?: string;
}

export default function LifeAndWork ({ className = '' }: Props): React.ReactElement {
const { t } = useTranslation();
const { allCodes, codeTrigger } = useCodes();
const { allContracts } = useContracts();
const [isAddOpen, toggleAdd] = useToggle();
const [isHashOpen, toggleHash] = useToggle();
const [isUploadOpen, toggleUpload] = useToggle();
const [isClaimOpen, toggleClaim] = useToggle();
const [isResumeOpen, toggleResume] = useToggle();
const [isSearch, toggleSearch] = useToggle();

const refTitle: string[] = [' Display your Claims and make new Claims for Education, Expertise, Work History, Good Deeds and Intellectual Property ', ' Enter your claim data below. (Click again to close) ', ' Look up Resumes for specific accounts. (Click again to close) ', ' Search Claims by Keywords. Enter your search keyword below and select Read. (Click again to close) '];
// todo ---> allCodes
console.log(allCodes);

  return (
    <StyledDiv className={className}>

    <Summary  />

      <Card>
        {!isResumeOpen && !isSearch && (
        <><Button
                icon={(isClaimOpen) ? 'minus' : 'plus'}
                label={t('Make a claim')}
                onClick={toggleClaim}>
          </Button></>
        )}
        {!isClaimOpen && !isSearch && (
          <>
              <Button
                icon={(isResumeOpen) ? 'minus' : 'plus'}
                label={t('Get Resumes')}
                onClick={toggleResume}>
              </Button>    
          </>
        )}
        {!isClaimOpen && !isResumeOpen && (
          <>
          <Button
            icon={(isSearch) ? 'minus' : 'plus'}
            label={t('Search')}
            onClick={toggleSearch}>
          </Button>    
          </>
        )}

        {isResumeOpen && (
          <>{t<string>(refTitle[2])}</>
        )}
        {isClaimOpen && (
          <>{t<string>(refTitle[1])}</>
        )}
        {!isClaimOpen && !isResumeOpen && !isSearch &&(
          <>{t<string>(refTitle[0])}</>
        )}
        {isSearch && (
          <>{t<string>(refTitle[3])}</>
        )}
      </Card>

    {isResumeOpen && (
    <ContractsTable
      contracts={allContracts}
      updated={codeTrigger}
      initMessageIndex={7}
    />)}
    {isClaimOpen && (
    <ClaimType />)}
    {isSearch && (
    <ContractsTable
      contracts={allContracts}
      updated={codeTrigger}
      initMessageIndex={10}
    />)}


    {isUploadOpen && (
      <CodeUpload onClose={toggleUpload} />
    )}
    {isHashOpen && (
      <CodeAdd onClose={toggleHash} />
    )}
    {isAddOpen && (
      <ContractAdd 
      onClose={toggleAdd} 
      defaultAddress={''}/>
    )}

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

