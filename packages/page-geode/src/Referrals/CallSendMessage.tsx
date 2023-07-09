// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useState, useCallback } from 'react';

import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';
import styled from 'styled-components';
import { __RouterContext } from 'react-router';
import ContractsModal from './ContractsModal';
import ContractsTable from './ContractsTable';

interface Props {
  className?: string;
  onClear?: () => void;
  programID?: string;
  title?: string;
  description?: string;
  moreInfoLink?: string;
  photo?: string;
  firstLevelReward?: number;
  secondLevelReward?: number;
  maximumReward?: number;
  ownerApprovedRequired?: boolean;
  payInMinimum?: number;
  claimId?: string;
  callIndex: number;
  isModal: boolean;
  onReset?: () => void;
}

function CallSendMessage ({ className = '', onClear, programID, title, 
                            description, moreInfoLink, photo, firstLevelReward, 
                            secondLevelReward, maximumReward, ownerApprovedRequired, 
                            payInMinimum, claimId, callIndex,
                            isModal, onReset }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
    // const [isCallOpen, setIsCallOpen] = useState(true);
    // const _toggleCall = useCallback(
    //   () => <>
    //   {setIsCallOpen((isCallOpen) => !isCallOpen)}
    //   </>,
    //   []
    // );

//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function SendMessage(): JSX.Element {
    return(
        <div>
            {isModal? (<> 
              <ContractsModal
                programID={programID}
                title={title}
                description={description}
                moreInfoLink={moreInfoLink}
                photo={photo}
                firstLevelReward={firstLevelReward}
                secondLevelReward={secondLevelReward}
                maximumReward={maximumReward}
                ownerApprovedRequired={ownerApprovedRequired}
                payInMinimum={payInMinimum}
                claimId={claimId}
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={callIndex}
            />                                   
            </>): (<>
             <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={callIndex}
             />
            </>)}
        </div>
    )
}

  return (
    <StyledDiv className={className}>
      <SendMessage />
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

export default React.memo(CallSendMessage);


