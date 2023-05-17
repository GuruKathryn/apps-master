// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import {  Table } from 'semantic-ui-react'

//import type { CallResult } from './types';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
//import { stringify, hexToString, isHex } from '@polkadot/util';
import { AccountName, Button, Badge, IdentityIcon, Card, LabelHelp } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
//import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import CopyToClipboard from 'react-copy-to-clipboard';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
}

function CallStats ({ className = '', onClear }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
//    const [showInstructions, toggleShowInstructions] = useToggle(false);
// todo: use instructions?? - update for endorse

    function CallInterestStats(): JSX.Element {
    return(
        <div> 
                <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={14}
                    />                              
        </div>
    )
}

  return (
    <StyledDiv className={className}>
    <Card>  
      <CallInterestStats />
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

export default React.memo(CallStats);


