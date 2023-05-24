// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Expander, AccountName, IdentityIcon, Button, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';

//import {  Table } from 'semantic-ui-react'

//import type { CallResult } from './types';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
//import { stringify, hexToString, isHex } from '@polkadot/util';
//import { Badge, Card, LabelHelp } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
//import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import CopyToClipboard from 'react-copy-to-clipboard';

//import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
  messageId?: string;
  fromAcct?: string;
  username?: string;
  postMessage?: string;
}

function CallFollow ({ className = '', onClear, messageId, fromAcct, username, postMessage }: Props): React.ReactElement<Props> | null {
//    const { t } = useTranslation();
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
//    const _onClear = () => onClear;

    function MakeAccountFollow(): JSX.Element {
    return(
        <div>


                <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={4}
                        messageId={messageId}
                        fromAcct={fromAcct}
                        username={username}
                        postMessage={postMessage}            
                    />                       
        </div>
    )
}

  return (
    <StyledDiv className={className}>
      <MakeAccountFollow />
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

export default React.memo(CallFollow);


