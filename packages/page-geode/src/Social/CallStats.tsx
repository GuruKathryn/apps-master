// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';

import styled from 'styled-components';
import { Card } from '@polkadot/react-components';
import { __RouterContext } from 'react-router';
//import ContractsTable from './ContractsTable';
import ContractsModal from './ContractsModal';

interface Props {
  className?: string;
  onClear?: () => void;
}

function CallStats ({ className = '', onClear }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function CallInterestStats(): JSX.Element {
    return(
        <div> 
                <ContractsModal
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


