// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import {  Table, Label } from 'semantic-ui-react'

//import type { CallResult } from './types';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
//import { stringify, hexToString, isHex } from '@polkadot/util';
import { AccountName, Button, Badge, IdentityIcon, Card, LabelHelp } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import CopyToClipboard from 'react-copy-to-clipboard';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
}

function CallEndorse ({ className = '', onClear }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    const [showInstructions, toggleShowInstructions] = useToggle(false);
// todo: use instructions?? - update for endorse

    function MakePost(): JSX.Element {
    return(
        <div>
            <h2>
            <Badge
                  icon='info'
                  color={(showInstructions) ? 'blue' : 'gray'}
                  onClick={toggleShowInstructions}  
                /> 
            <strong>{t<string>(' Endorse ')}</strong></h2>
            {showInstructions && (<>
                <strong>{t<string>('Instructions for Endorsing: ')}</strong><br />
            {'(1) '}{t<string>('Make Sure the (account to use) is NOT the owner of the message')}<br /> 
            {'(2) '}{t<string>('Copy the Message ID to Endorse into the (thisMessageId: Hash) field below')}<br />
            {'(3) '}{t<string>('Click Submit button to sign and submit this transaction')}<br /><br />
            {t<string>('⚠️ Please Note: You can not endorse your own claims.')}            
            </>)}
        <Table>
          <Table.Row>
            <Table.Cell>  
                    <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={2}
                    />                
            </Table.Cell>
          </Table.Row>
        </Table>
        </div>
    )
}

  return (
    <StyledDiv className={className}>
    <Card>  
      <MakePost />
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

export default React.memo(CallEndorse);


