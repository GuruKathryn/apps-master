// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

//import {  Table, List, Label } from 'semantic-ui-react'

//import type { CallResult } from './types';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
//import { stringify, hexToString, isHex } from '@polkadot/util';
// import { Badge, LabelHelp } from '@polkadot/react-components';
// import { List, Label, Divider } from 'semantic-ui-react'

import { __RouterContext } from 'react-router';
//import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import Output from '@polkadot/app-js/Output';
//import CopyToClipboard from 'react-copy-to-clipboard';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
  claimId?: string;
  claimant?: string;
  claim?: string;
  showBool?: boolean;
}

function ShowHideClaims ({ className = '', onClear, claimId, claimant, claim, showBool }: Props): React.ReactElement<Props> | null {
  //  const { t } = useTranslation();
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
  //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

function CallContractCard(): JSX.Element {
    return(
        <div>
            <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={6}
                        claimId={claimId}
                        claimant={claimant}
                        claim={claim}
                        showBool={showBool}
             />
        </div>
    )
}

  return (
    <StyledDiv className={className}>
    <>  
      <CallContractCard />
    </>
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

export default React.memo(ShowHideClaims);


