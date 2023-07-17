// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useState, useCallback } from 'react';

import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';
import styled from 'styled-components';
import { __RouterContext } from 'react-router';
import ContractsTable from './ContractsTable';

interface Props {
  className?: string;
  onClear?: () => void;
  passListingID?: string;
  passOfferCoin?: string;
  passAskingCoin?: string;
  passPrice?: number;
  passMethod?: string;
  passInventory?: number;
  passCountry?: string;
  passCity?: string;
  passNotes?: string;
  callIndex: number;
}

function CallSendMessage ({ className = '', onClear, passListingID, passOfferCoin, passAskingCoin, 
                          passPrice, passMethod, passInventory, passCountry, passCity, passNotes,
                          callIndex,
                          }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();

    //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function SendMessage(): JSX.Element {
    return(
        <div>
             <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                passListingID={passListingID}
                passOfferCoin={passOfferCoin}
                passAskingCoin={passAskingCoin}
                passPrice={passPrice}
                passMethod={passMethod}
                passInventory={passInventory}
                passCountry={passCountry}
                passCity={passCity}
                passNotes={passNotes}
                initMessageIndex={callIndex}
             />
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


