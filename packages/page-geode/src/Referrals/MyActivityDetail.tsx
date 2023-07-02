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
import CopyInline from '../shared/CopyInline';
import { useToggle, useDebounce } from '@polkadot/react-hooks';

import AccountHeader from '../shared/AccountHeader';
import CallSendMessage from './CallSendMessage';

//import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    onClose: boolean;
  }

  type BranchsObj = {
    branchId: string,
    programId: string,
    branch: string[]
  }

  type PayoutsObj = {
    payoutId: string,
    programId: string,
    claimId: string,
    childAccount: string,
    childPayout: number,
    parentAccount: string,
    parentPayout: number,
    grandparentAccount: string,
    grandparentPayout: number,
    timestamp: number,
    totalPayout: number
  }

  type ClaimsObj = {
    programId: string,
    claimId: string,
    parent: string,
    parentIp: string,
    child: string,
    childIp: string,
    timestamp: number,
    grandparent: string,
    branch: string[],
    payIn: number,
    endorseBy: string,
    payoutId: string,
    status: number
  }
  
  type ProgramObj = {
    programId: string,
    title: string,
    description: string,
    moreInfoLink: string,
    photo: string,
    firstLevelReward: number,
    secondLevelReward: number,
    maximumRewards: number,
    rewardsGiven: number,
    ownerApprovalRequired: boolean,
    payInMinimum: number,
    claims: ClaimsObj[],
    payouts: PayoutsObj[],
    branches: BranchsObj[],
  }
  
  type Program = {
    activity: ProgramObj[]
  }

  type ProgramDetail = {
  ok: Program
  }
  
function MyActivityDetails ({ className = '', onClear, onClose, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
   // const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    //const [modalEnum, setModalEnum] = useState(['','','','','',0,0,0,false,0]);
    
    const [useProgramId, setProgramId] = useState('');
    const [useTitle, setTitle] = useState('');
    const [useDescription, setDescription] = useState('');
    const [useMoreInfoLink, setMoreInfoLink] = useState('');
    const [usePhoto, setPhoto] = useState('');
    const [useFirstLevelReward, setFirstLevelReward] = useState(0);
    const [useSecondLevelReward, setSecondLevelReward] = useState(0);
    const [useMaxRewards, setMaxRewards] = useState(0);
    const [useOwnerApprovedRequired, setOwnerApprovedRequired] = useState(false);
    const [usePayInMinimum, setPayInMinimum] = useState(0);

    const [isEndorse, setEndorse] = useState(false);
    const [isUpdate, setUpdate] = useState(false);
    const [isDeactivate, setDeactivate] = useState(false);
    const [isActivate, setActivate] = useState(false);
    
    //const [isReset, toggleReset] = useToggle(false);
    
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const programDetail: ProgramDetail = Object.create(_Obj);
    
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
//    const [isNewProgram, toggleNewProgram] = useToggle(false);
    //const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
    //const dbIsFund = useDebounce(isFund);

    

    const _reset = useCallback(
      () => {setEndorse(false);
             setUpdate(false);
             setDeactivate(false);
             setActivate(false);
            },
      [isEndorse, isUpdate, isDeactivate, isActivate]
    )
    
    const _makeEndorse = useCallback(
      () => {setEndorse(true);
             setUpdate(false);
             setDeactivate(false);
             setActivate(false);
             //toggleReset();
            },
      [isEndorse, isUpdate, isDeactivate, isActivate]
    )
    
    const _makeUpdate = useCallback(
      () => {setEndorse(false);
             setUpdate(true);
             setDeactivate(false);
             setActivate(false);
            },
      [isEndorse, isUpdate, isDeactivate, isActivate]
    )
    
    const _makeDeactivate = useCallback(
      () => {setEndorse(false);
             setUpdate(false);
             setDeactivate(true);
             setActivate(false);
            },
      [isEndorse, isUpdate, isDeactivate, isActivate]
    )
    
    const _makeActivate = useCallback(
      () => {setEndorse(false);
             setUpdate(false);
             setDeactivate(false);
             setActivate(true);
            },
      [isEndorse, isUpdate, isDeactivate, isActivate]
    )



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

    //   function booleanToStatus(_bool: boolean): JSX.Element {
    //     return(<>
    //     <Label
    //         circular
    //         size='mini'
    //         color={_bool? 'blue': 'red'}>
    //     {_bool? 'Active': 'Inactive'}
    //     </Label>
    //     </>)
    //   }

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
                {programDetail.ok.activity.length>0 && programDetail.ok.activity.map((_programs, index: number) => <>
                  <Grid columns={4} divided>
                    <Grid.Row>
                      <Grid.Column>
                        {renderLink(_programs.photo)}
                        <Label as='a' size='small' 
                                color={'orange'}
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {_makeEndorse()}
                                          </>}} >{'Endorsed'}</Label>

                        <Label as='a' size='small' color='orange'
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {setMoreInfoLink(_programs.moreInfoLink)}
                                       {setPhoto(_programs.photo)}
                                       {setFirstLevelReward(_programs.firstLevelReward)}
                                       {setSecondLevelReward(_programs.secondLevelReward)}
                                       {setMaxRewards(_programs.maximumRewards)}
                                       {setOwnerApprovedRequired(_programs.ownerApprovalRequired)}
                                       {setPayInMinimum(_programs.payInMinimum)}
                                       {_makeUpdate()}
                                       </>}} >{'Update'}</Label>

                        <Label as='a' size='small' color='orange'
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {_makeDeactivate()}
                                       </>}} >{'Deactivate'}</Label>

                        <Label as='a' size='small' color='orange'
                               onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {_makeActivate()}
                                       </>}} >{'Reactivate'}</Label>
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
                      <Grid.Column>
                      <h3><strong>{t<string>('Claims: ')}</strong></h3>
                      {_programs.claims.length>0 && _programs.claims.map(_claim =>{
                        <>
                        {t<string>('Program ID: ')}{_claim.programId}
                        
                        </>
                      })}
                      <h3><strong>{t<string>('Payouts: ')}</strong></h3>
                      <h3><strong>{t<string>('Branches: ')}</strong></h3>                         
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
      {isEndorse && !isUpdate && !isDeactivate && !isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={1}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {!isEndorse && isUpdate && !isDeactivate && !isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         moreInfoLink={useMoreInfoLink}
         photo={usePhoto}
         firstLevelReward={useFirstLevelReward}
         secondLevelReward={useSecondLevelReward}
         maximumReward={useMaxRewards}
         ownerApprovedRequired={useOwnerApprovedRequired}
         payInMinimum={usePayInMinimum}
         callIndex={4}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {!isEndorse && !isUpdate && isDeactivate && !isActivate &&  (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={5}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {!isEndorse && !isUpdate && !isDeactivate && isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={6}
         isModal={true}
         onClear={() => _reset()}
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
export default React.memo(MyActivityDetails);
