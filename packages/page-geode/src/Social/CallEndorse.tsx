// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

//import {  Table } from 'semantic-ui-react'

//import type { CallResult } from './types';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
//import { stringify, hexToString, isHex } from '@polkadot/util';
import { Badge, Card, LabelHelp } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
//import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import CopyToClipboard from 'react-copy-to-clipboard';

//import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
  isPost: boolean;
  //isModal: boolean;
  messageId?: string;
  fromAcct?: string;
  username?: string;
  postMessage?: string;
  //called: boolean;
}

function CallEndorse ({ className = '', onClear, isPost, messageId, fromAcct, username, postMessage }: Props): React.ReactElement<Props> | null {
//    const { t } = useTranslation();
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function MakePost(): JSX.Element {
    return(
        <div>
  
              {isPost? (<>
                <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={2}
                        messageId={messageId}
                        fromAcct={fromAcct}
                        username={username}
                        postMessage={postMessage}   
                        //called={called}            
                    />                              
              </>) : (<>
                <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={3}
                        //called={called}
                    />                              
              </>)}
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


