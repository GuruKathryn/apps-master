// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from '../shared/types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Button, LabelHelp, Card } from '@polkadot/react-components';
import { Label, Table, Divider } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import AccountHeader from '../shared/AccountHeader';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
type SettingsObj = {
    callerInterests: string,
    callerInboxFee: number,
    callerLastUpdate: number,
    callerHide: boolean,
    callerUsername: string
    interests: string[],
    inboxFee: number[],
    lastUpdate: number[]
  }

type SettingsDetail = {
  ok: SettingsObj
  }
  
function UserSettingsDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const settingsDetail: SettingsDetail = Object.create(_Obj);

    function feeAverage(_fee: number[]): string {
        return(_fee.reduce((a,b) => a+b)/_fee.length).toString()
    }

    function booltoHuman(_bool: boolean): string {
        return(_bool? t<string>('Private'): t<string>('Public'))
    }

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

   function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
    
  function removeSpaces(arr: string[]) {
    return arr.map(_w => (_w.trim()).toLowerCase() // Normalize
    .replace(/["“”(\[{}\])]|\B['‘]([^'’]+)['’]/g, '$1') // Strip quotes and brackets
    .replace(/[‒–—―…]|--|\.\.\./g, ' ') // Strip dashes and ellipses
    .replace(/[!?;:.,]\B/g, '')); // Strip punctuation marks
  }
  
  function ShowOrderByAlpha(inStr: string, inArr: string[]): JSX.Element {
    return(
            <>{inArr.map((_word, index: number) => 
                      <>
                      {_word.trim()!='' && (
                          <div>
                          <CopyInline value={_word.trim()} label={''}/>
                          {inStr.split(_word.trim()).length - 1 > 0 ? (
                          <>
                          <strong>{_word.trim()}{': '}</strong>
                          <Label color={inStr.split(_word.trim()).length - 1 < 2 ? 'grey' : 'blue'} 
                              circular>
                              {inStr.split(_word.trim()).length - 1}
                          </Label>
                          </>
                          ) : (
                          <>{_word.trim()}</>
                          )
                      }
                      <br />
                      </div>
                )}</>)}</>
              )
  }
  
  // function ShowOrderByFreq(inStr: string, inArr: string[]): JSX.Element {
  //   const arr = orderByFrequency(inStr, inArr);
  //   return (
  //   <>
  // {arr.map((_word, index: number) => 
  //       <>
  //        {_word.freq != 0 ? (
  //         <>
  //         <CopyInline value={_word.interest} label={''}/>
  //           <strong>{_word.interest.trim()}</strong>{': '}
  //             <Label color={_word.freq < 2 ? 'grey' : 'blue'} 
  //                     circular>
  //                     {_word.freq}
  //             </Label>
  //           <br />
  //         </>
  //        ) : ''}
  //       </>)
  //     }    
  //   </>
  //     )
  // }
  
  // function orderByFrequency(inStr: string, inArr: string[]) {
  //   return inArr.map(_word => _word !='' ? 
  //         {"interest": _word, "freq": (inStr.split(_word).length - 1) } :
  //         {"interest": '', "freq": 0})
  //         .sort((a, b) => b.freq - a.freq)
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
        const maxIndex: number = settingsDetail.ok.interests.length;
        const averageFee: string = feeAverage(settingsDetail.ok.inboxFee);
        const modArr: string[] = (settingsDetail.ok.interests.map(_w => hextoHuman(_w).trimStart() + ', ')).concat();
        const strArr: string = JSON.stringify(modArr.toString().split(','));
        const strObj: string[] = removeDuplicates(removeSpaces(JSON.parse(strArr)));
    
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <h2><strong>{t<string>('Your Settings:')}</strong></h2>
                <strong>{t<string>('User Name: ')}</strong>{hextoHuman(settingsDetail.ok.callerUsername)}<br />
                <strong>{t<string>('Last Update: ')}</strong>{timeStampToDate(settingsDetail.ok.callerLastUpdate)}<br />
                <strong>{t<string>('Paid Inbox Fee: ')}</strong>{settingsDetail.ok.callerInboxFee}{' Geode'}<br />
                <strong>{t<string>('Account Type: ')}</strong>{booltoHuman(settingsDetail.ok.callerHide)}< br />
                <strong>{t<string>('Interests: ')}</strong>
                {hexToString(settingsDetail.ok.callerInterests)}
                
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t<string>(' Interest Areas: ')} />
                <strong>{t<string>(' Interests: ')}</strong></h2> 


            <strong>{'Interest Word Analysis :'}</strong><br /><br />
              {t<string>('(1) Total Number of Users In Data: ') } <strong>{maxIndex}</strong><br />
              {t<string>('(2) Total Number of Unique Words/Phrases: ')}<strong>{strObj.length}</strong><br /><br />

              <>
                  <br />
                  <u><strong>{t<string>(' Interest Words by User Accounts:')}</strong></u><br /><br />
                  
                  {settingsDetail.ok.interests.map((_word, index: number) => 
                    <>
                    <CopyInline value={hextoHuman(_word)} label={''}/>
                    {hextoHuman(_word)}<br />
                    </>)
                  }    
                <Divider />
                </>

                <>
                <br /><br />

                <u><strong>{t<string>('Interest Words: ')}</strong></u><br /><br />
                {ShowOrderByAlpha(strArr, strObj)}            
                <br /><br />
                </> 

            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t<string>(' InBox Fees: ')} />
                <strong>{t<string>(' Fees: ')}</strong>
                {t<string>('Average Fee: ')}<strong>{averageFee}</strong>
            </h2> 
                <br />
                <u><strong>{t<string>('Fees by Users: ')}</strong></u><br /><br />
                {settingsDetail.ok.inboxFee.length>0 && 
                  settingsDetail.ok.inboxFee.map((_data, index: number)=> <>
                  <CopyInline value={_data.toString()} label={''}/>

                  <strong>{_data}{' Geode'}</strong><br />
                </>)
                }
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t<string>(' Last Updates: ')} />
                <strong>{t<string>(' Last Updates: ')}</strong>
            </h2> <br />
                <u><strong>{t<string>('Updates by Users: ')}</strong></u><br /><br />
                {settingsDetail.ok.lastUpdate.length>0 && 
                  settingsDetail.ok.lastUpdate.map((_data, index: number)=> <>
                  <strong>{timeStampToDate(_data)}</strong><br />
                  </>)}
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
export default React.memo(UserSettingsDetails);
