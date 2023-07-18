// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Card } from '@polkadot/react-components';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
import { __RouterContext } from 'react-router';
//import ContractsTable from './ContractsTable';
import ContractsModal from './ContractsModal';

interface Props {
  className?: string;
  onClear?: () => void;
  messageId?: string;
  fromAcct?: string;
  username?: string;
  postMessage?: string;
}

function CallFollow ({ className = '', onClear, messageId, fromAcct, username, postMessage }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function MakeAccountFollow(): JSX.Element {
    return(
        <div>
                <ContractsModal
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={4}
                    />                       
        </div>
    )
}

  return (
    <StyledDiv className={className}>
      <Card>
      <MakeAccountFollow />
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

export default React.memo(CallFollow);


