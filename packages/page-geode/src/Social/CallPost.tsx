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
  isPost?: boolean;
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

    //const isShowTest: boolean = false;
  //  const isDontShow: boolean = true;
  //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    //const showInstructions: boolean = true;
    const [showInstructions, toggleShowInstructions] = useToggle(false);

    function MakePost(): JSX.Element {
    return(
        <div>
            {isPost ? (
                <>
                <h2>
                <Badge
                  icon='info'
                  color={(showInstructions) ? 'blue' : 'gray'}
                  onClick={toggleShowInstructions}  
                /> 
                    <strong>{t<string>(' Make a Post ')}</strong>            
                </h2>
                </>
            ) : (
                <>
                <h2><strong>{t<string>('Make a Paid Post')}</strong></h2>               
                </>
            )}
            {showInstructions && (<>
            <strong>{t<string>('Instructions for Making a Post: ')}</strong><br />
            {'(1) '}{t<string>('Select the (account to use) for the Post.')}<br /> 
            {'(2) '}{t<string>('Enter the message in (newMessage:) text field.')}
            {t<string>(' ⚠️ Note: The Text field will change color if all entered characters are excepted.')}<br />            
            {'(3) '}{t<string>('Enter a valid link including Web pages, Photos, Video clips, etc.')}<br />
            {'(4) '}{t<string>('If entering a Reply Post, enter the message Id of the original Post.')}<br /><br />
            {t<string>('Click Submit Button below to make your Post.')}            
            </>)}
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


