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
//import { useToggle } from '@polkadot/react-hooks';
import ContractsTable from './ContractsTable';
//import CopyToClipboard from 'react-copy-to-clipboard';
//import JSONSocialInterests from '../shared/geode_social_interest.json';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClear?: () => void;
  isPost: boolean;
}

function CallPost ({ className = '', onClear, isPost }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    //const [isModalOpen, toggleModal] = useToggle();
    //const [isIndex, setIsIndex] = useState(0);
    // todo placeholder functionality -- remove console.log
    //console.log(isIndex);
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
    //const claimIdRef: string[] = [' ', 'work history', 'education', 'expertise', 'good deeds', 'intellectual property', '', '', ' - Get Resume', '', '', '', ' - Search', '', '', '', '', '', ''];
    //const [showButton, setShowButton] = useState(true);
    //const interestWords: string[] = JSONSocialInterests;

    //const isShowTest: boolean = false;
  //  const isDontShow: boolean = true;
  //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    //const showInstructions: boolean = true;
    //const [showInstructions, toggleShowInstructions] = useToggle(false);

    function MakePost(): JSX.Element {
    return(
        <div>
        <Table>
          <Table.Row>
            <Table.Cell>  
            {isPost ? (
                <>
                    <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={0}
                    />                
                </>
            ) : (
                <>
                    <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={1}
                    />                                
                </>

            )}            
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

export default React.memo(CallPost);


