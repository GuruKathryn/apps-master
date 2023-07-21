// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from '../shared/types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Badge, Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Divider, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import AccountHeader from '../shared/AccountHeader';
import { useToggle } from '@polkadot/react-hooks';

import CallSendMessage from './CallSendMessage';


//import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
type SettingsObj = {
    interests: string[],
    inboxFee: string[],
    lastupdate: number[],
  }

type SettingsDetail = {
  ok: SettingsObj
  }
  
function SettingsDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
//    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
//    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const settingsDetail: SettingsDetail = Object.create(_Obj);

    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    
    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '';
      return(_Out)
    }
    
    function timeStampToDate(tstamp: number): JSX.Element {
      try {
       const event = new Date(tstamp);
       return (
            <><i>{event.toDateString()}{' '}
                 {event.toLocaleTimeString()}{' '}</i></>
        )
      } catch(error) {
       console.error(error)
       return(
           <><i>{t<string>('No Date')}</i></>
       )
      }
   }

  //  function renderLink(_link: string): JSX.Element {
  //   const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
  //   const videoLink: string = (ilink.includes('embed')) ? ilink 
  //       : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
  //           : ('https://www.youtube.com/embed/' + ilink.slice(32));
  
  //   return(
  //     <>
  //     {ilink.trim() != 'http://' ? (<>
  //       {(ilink).includes('youtu')? (
  //       <iframe width="450" height="345" src={videoLink +'?autoplay=0&mute=1'}> 
  //       </iframe>) : (
  //       <Image bordered rounded src={ilink} size='large' />
  //       )}    
  //     </>) : <>{''}</>}
  //     <br /></>
  //   )
  // }
  // function _renderLink(_link: string): JSX.Element {
  //   return(<>
  //          <link
  //           href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''}
  //           target="_blank" 
  //           rel="noopener noreferrer">
  //           </link>
  //   </>)
  // }

    // function autoCorrect(arr: string[], str: string): JSX.Element {
    //     arr.forEach(w => str = str.replaceAll(w, '****'));
    //     arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
    //     arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
    //     arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
    //     return (
    //     <>{t<string>(str)}</>)
    // }

    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t<string>(' Close ')}
                  onClick={onClear}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  
      
function ShowData(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {' Total InBox: '}
                {' Total Lists: '}
                {' Total Groups: '}
                
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t<string>(' Your Interest Areas: ')} />
                <strong>{t<string>(' Interests: ')}</strong></h2> 
                {settingsDetail.ok.interests.length>0 && 
                  settingsDetail.ok.interests.map((_data, index: number)=> <>
                  <h3><strong>{hextoHuman(_data)}</strong></h3>
                </>)
                }
            </Table.Cell>

          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Lists ')} />
                <strong>{t<string>(' Lists: ')}</strong></h3> 
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t<string>(' Your Groups ')} />
                <strong>{t<string>(' Groups: ')}</strong></h3> 
            </Table.Cell>
          </Table.Row>

      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Data in your InBox')}</Card>
        </div>
      )
    }
}
    

  return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={2}/>
      <ListAccount />
      <ShowData />
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
export default React.memo(SettingsDetails);
