// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from '../shared/types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Badge, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Table, Label, Image } from 'semantic-ui-react'
// import CopyInline from '../shared/CopyInline';
// import { useToggle } from '@polkadot/react-hooks';

import AccountHeader from '../shared/AccountHeader';
import CallSendMessage from './CallSendMessage';
//import IpAddress from '../shared/IpAddress'

//import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    onClose: boolean;
  }
  
  type ProgramObj = {
    programId: string,
    owner: string,
    title: string,
    description: string,
    moreInfoLink: string,
    photo: string,
    firstLevelReward: number,
    secondLevelReward: number,
    maximumRewards: number,
    rewardsGiven: number,
    ownerApprovalRequired: boolean,
    payInMinimum: number
  }
  
  type Program = {
    programs: ProgramObj[]
  }

  type ProgramDetail = {
  ok: Program
  }
  
function BrowseDetails ({ className = '', onClear, onClose, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    
    const [useProgramId, setProgramId] = useState('');
    const [useTitle, setTitle] = useState('');
    const [useDescription, setDescription] = useState('');

    const [isClaim, setClaim] = useState(false);
    const [count, setCount] = useState(0);

    
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const programDetail: ProgramDetail = Object.create(_Obj);
    
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const _reset = useCallback(
      () => {setClaim(false);           
            },
      []
    )  

    const _makeClaim = useCallback(
      () => {setClaim(true);        
            },
      []
    )
        

    // function timeStampToDate(tstamp: number): JSX.Element {
    //     try {
    //      const event = new Date(tstamp);
    //      return (
    //           <><i>{event.toDateString()}{' '}
    //                {event.toLocaleTimeString()}{' '}</i></>
    //       )
    //     } catch(error) {
    //      console.error(error)
    //      return(
    //          <><i>{t<string>('No Date')}</i></>
    //      )
    //     }
    //  }

     function renderLink(_link: string): JSX.Element {
        const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
        const videoLink: string = (ilink.includes('embed')) ? ilink 
                : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
                  : ('https://www.youtube.com/embed/' + ilink.slice(32));
      
        return(
          <>
          {ilink.trim() != 'http://' ? (<>
            {(ilink).includes('youtu')? (
            <iframe width="250" height="145" src={videoLink +'?autoplay=0&mute=1'}> 
            </iframe>) : (
            <Image bordered rounded src={ilink} size='small' />
            )}    
          </>) : <>{''}</>}
          <br /></>
        )
      }
      
      function BNtoGeode(_num: number): JSX.Element {
        return(<>
            {_num>0? <>{(_num/1000000000000).toString()}{' Geode'}</>: <>{'0'}</>}
        </>)
      }

      function booleanToHuman(_bool: boolean): JSX.Element {
        return(<>
        <Badge 
                isSmall
                icon={_bool? 'thumbs-up': 'thumbs-down'}
                color={_bool? 'blue': 'red'}
                info={_bool? 'Yes': 'No'}              
               />
        </>
        )
      }

      // function booleanToStatus(_bool: boolean): JSX.Element {
      //   return(<>
      //   <Label
      //       circular
      //       size='mini'
      //       color={_bool? 'blue': 'red'}>
      //   {_bool? 'Active': 'Inactive'}
      //   </Label>
      //   </>)
      // }

      function linkToButton(_link: string): JSX.Element {
        return(<>
          <Label  as='a'
                  color='orange'
                  circular
                  size={'mini'}
                  href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{t<string>('Link')}
          </Label>
        </>)
      }

      function hextoHuman(_hexIn: string): string {
        const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '';
        return(_Out)
      }
      
    function ShowSubMenus(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t<string>('Close')}
                  onClick={onClear}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}
      
      function ShowPrograms(): JSX.Element {
        try{
          return(
            <div>
              <Table>
                <Table.Row>
                <Table.Cell verticalAlign='top'>
                {programDetail.ok.programs.length>0 && programDetail.ok.programs.map((_programs, index: number) => <>
                  <Grid columns={4} divided>
                    <Grid.Row>
                      <Grid.Column>
                        {renderLink(_programs.photo)}                  
                          <Label as='a' size='small' 
                                color={'orange'}
                                onClick={()=>{
                                        <>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {setCount(count + 1)}
                                       {_makeClaim()}
                                          </>}} >{'Claim'}</Label>
                        

                      </Grid.Column>
                      <Grid.Column>
                      <h3><strong>{t<string>('Title: ')}</strong>{hextoHuman(_programs.title)}</h3>
                          <strong>{t<string>('Description: ')}</strong>{hextoHuman(_programs.description)}<br />
                          <strong>{t<string>('1st level reward: ')}</strong>{BNtoGeode(_programs.firstLevelReward)}<br />
                          <strong>{t<string>('2nd level reward: ')}</strong>{BNtoGeode(_programs.secondLevelReward)}<br />
                          <strong>{t<string>('Maximum number of rewards: ')}</strong>{_programs.maximumRewards}<br />
                          <strong>{t<string>('Rewards Given: ')}</strong>{_programs.rewardsGiven}<br />
                          <strong>{t<string>('Owner approval needed to trigger reward: ')}</strong>{booleanToHuman(_programs.ownerApprovalRequired)}<br />
                          <strong>{t<string>('Pay It Forward Minimum: ')}</strong>{BNtoGeode(_programs.payInMinimum)}<br />
                          <strong>{t<string>('More Info Link: ')}</strong>{linkToButton(_programs.moreInfoLink)}<br />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
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
              <Card>{t<string>('No Programs to Show')}</Card>
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
      <ShowSubMenus />
      {isClaim && (
       <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={0}
         isModal={true}
         onReset={() => _reset()}
      />
      )}

      <ShowPrograms />
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
export default React.memo(BrowseDetails);
