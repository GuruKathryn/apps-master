// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useState, useCallback } from 'react';

import { useContracts } from '../useContracts';
import { useCodes } from '../useCodes';
import styled from 'styled-components';
import { __RouterContext } from 'react-router';
import ContractsModal from './ContractsModal';
//import ContractsTable from './ContractsTable';

interface Props {
  className?: string;
  myAccount?: string;
  displayName?: number;
  location?: number;
  tags?: number;
  bio?: number;
  photoUrl?: number;
  websiteUrl1?: number;
  websiteUrl2?: number;
  websiteUrl3?: number;
  lifeAndWork?: string;
  social?: string;
  privateMessage?: string;
  marketPlace?: string;
  moreInfo?: number;
  makePrivate?: boolean;
  onReset?: () => void;
  callIndex: number;
}

function CallSendMessage ({ className = '', myAccount, displayName, 
                            location, tags, bio, photoUrl, 
                            websiteUrl1, websiteUrl2, websiteUrl3, 
                            lifeAndWork, social, privateMessage,
                            marketPlace, moreInfo, makePrivate,
                            onReset, callIndex }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
    // onReset=true;
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
              <ContractsModal
                myAccount={myAccount}
                displayName={displayName}
                location={location}
                tags={tags}
                bio={bio}
                photoUrl={photoUrl}
                websiteUrl1={websiteUrl1}
                websiteUrl2={websiteUrl2}
                websiteUrl3={websiteUrl3}
                lifeAndWork={lifeAndWork}
                social={social}
                privateMessage={privateMessage}
                marketPlace={marketPlace}
                moreInfo={moreInfo}
                makePrivate={makePrivate}
                contracts={allContracts}
                updated={codeTrigger}
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


