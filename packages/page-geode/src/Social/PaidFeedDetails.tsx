// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Button, Badge, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { List, Table, Label, Image, Divider } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle } from '@polkadot/react-hooks';
//import JSONSocialInterests from '../shared/geode_social_interest.json';
import JSONprohibited from '../shared/geode_prohibited.json';
import AccountHeader from '../shared/AccountHeader';
//import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    //isShowEndorsers?: boolean;
    //isShowInterest?: boolean;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type MessageObj = {
    messageId: string,
    replyTo: string,
    fromAcct: string,
    username: string,
    message: string,
    link: string,
    link2: string,
    endorserCount: number,
    timestamp: number,
    paidEndorserMax: number,
    endorserPayment: number,
    targetInterests: string,
    totalStaked: number,
    endorsers: string[]
  }

  type FeedObj = {
    maxfeed: number,
    myinterests: string,
    blocked: string[],
    mypaidfeed: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }
  
function PaidFeedDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    //const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const [countPost, setCountPost] = useState(0);

    const [isShowBlockedAccounts, toggleShowBlockedAccounts] = useToggle(false);
    const [isShowMyInterest, toggleShowInterest] = useToggle(false);
    const [isShowEndorsers, toggleShowEndorsers] = useToggle(false);
    const [isShowAdInterest, toggleShowAdInterest] = useToggle(false);

    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'

    let _Obj: Object = { "ok": {"maxfeed": 10, "myinterests":"0x646f67732c206172742c206d6f746f726379636c65732c20666f6f64", "blocked": ["5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy"], "mypaidfeed": [ { "messageId": "0x09d3adb1294121426054d65b1535ccbdcebc44220b8304360aeddbeb5d448eac", "replyTo": "0x0000000000000000000000000000000000000000000000000000000000000000", "fromAcct": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw", "username": "Nala the Wonder Dog", "message": "More Free Puppies, Buy One get Two FREE!", "link": "https://dogsbestlife.com/wp-content/uploads/2022/09/french-bulldog-puppy-scaled.jpeg", "endorserCount": 0, "timestamp": 1682109894001, "paidEndorserMax": 10, "endorserPayment": 100000000000000, "targetInterests": "dogs", totalStaked: 1000000000000000, "endorsers": [ "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw" ] } ] } }
    const objOutput: string = stringify(output);
    _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t<string>(str)}</>)
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

function hextoHuman(_hexIn: string): string {
        const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): ''
        return(_Out)
}

function unitToGeode(_unitIn: number): string{
    const _convert: number = 1000000000000;
    const _Out: string = (_unitIn / _convert).toString();
    return(_Out)
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
      <iframe width="450" height="345" src={videoLink +'?autoplay=0&mute=1'}> 
      </iframe>) : (
      <Image bordered rounded src={ilink} size='large' />
      )}    
    </>) : <>{''}</>}
    <br /></>
  )
}

function ShowFeed(): JSX.Element {
    setCountPost(0)
    try {
      const maxIndex: number = feedDetail.ok.maxfeed>0 ? feedDetail.ok.maxfeed: 0;
      return(
          <div>
            <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Button
                    icon='times'
                    label={t<string>('Close')}
                    onClick={onClear}
                  />
                  {t<string>(' Number of Posts: ')}
                  <strong>{countPost}</strong>
                  {t<string>(' | Number of Posts to show: ')}<strong>{maxIndex}</strong>
                  <br />
                </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                <Table.HeaderCell>
                <Badge
                icon={(isShowEndorsers) ? 'thumbs-up' : 'thumbs-down'}
                color={(isShowEndorsers) ? 'blue' : 'gray'}
                onClick={toggleShowEndorsers}/> 
                {t<string>(' Show Endorsers | ')}
                <Badge
                icon={(isShowAdInterest) ? 'thumbs-up' : 'thumbs-down'}
                color={(isShowAdInterest) ? 'blue' : 'gray'}
                onClick={toggleShowAdInterest}/> 
                {t<string>(' Show Ad Interests ')}
                {feedDetail.ok.blocked.length>0 && (
                  <>
                  {' | '}
                  <Badge
                  icon='info'
                  color={(isShowBlockedAccounts) ? 'blue' : 'gray'}
                  onClick={toggleShowBlockedAccounts}/> 
                  {t<string>(' Blocked: ')}<strong>{feedDetail.ok.blocked.length}</strong>
                  {isShowBlockedAccounts && feedDetail.ok.blocked.length>0 && (
                    <>
                    {feedDetail.ok.blocked.map(_blkd =>
                    <>{' ('}<AccountName value={_blkd} withSidebar={true}/>{') '}
                    </>)}
                    </>
                  )}
                  </>)}
                <br /><br />
                <Badge
                  icon='info'
                  color={(isShowMyInterest) ? 'blue' : 'gray'}
                  onClick={toggleShowInterest}/> 
                  {t<string>('Your Interests')}
                  {isShowMyInterest && feedDetail.ok.myinterests.length>0 && (<>{': ('}
                    {hextoHuman(feedDetail.ok.myinterests)}{') '}
                  </>)}
                  <br />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
                {feedDetail.ok.mypaidfeed.length>0 && feedDetail.ok.mypaidfeed
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all replies
                    //.filter(_subFeed => _subFeed.replyTo === zeroMessageId)
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    //.sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_feed, index: number) =>   
                    <>
                    {index < maxIndex && (
                    <>
                    <h3> <strong>{t<string>('@')}</strong>
                         <strong>{hextoHuman(_feed.username)}</strong>
                              {' ('}<AccountName value={_feed.fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_feed.endorserCount}</Label>
                              {' '}{timeStampToDate(_feed.timestamp)}{' '}
                          <CopyInline value={_feed.messageId} label={''}/>
                     </h3>
                            <i><strong>{t<string>('Payment: ')}{unitToGeode(_feed.endorserPayment)}{' Geode'}
                            {t<string>(', Paid Endorsements Left: ')}{_feed.paidEndorserMax-_feed.endorserCount}</strong></i>
                            <br />
                    {isShowEndorsers && _feed.endorserCount > 0 && (
                    <>
                    <List divided inverted >
                      {_feed.endorsers.length>0 && _feed.endorsers.map((name, i: number) => <List.Item key={name}> 
                        {(i > 0) && (<><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}
                        {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                        </>)}
                      </List.Item>)}
                    </List>     
                    </>
                    )}
                {isShowAdInterest && 
                      (<>
                      <br />{t<string>('Ad Target Interest: ')}{hextoHuman(_feed.targetInterests)}
                      </>)} 
                <br />      
                {renderLink(_feed.link)}
                {(_feed.link != '0x') ? (
                <>
                    {hextoHuman(_feed.message)}{' '}
                    <Label  as='a'
                    color='orange'
                    circular
                    href={isHex(_feed.link2) ? withHttp(hexToString(_feed.link2).trim()) : ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{t<string>('Link')}
                    </Label>{' '}
                    {isHex(_feed.link2) ? (
                        <LabelHelp help={withHttp(hexToString(_feed.link2).trim())} />
                        ) : ''}</>
                    ) : (
                    <>{(hextoHuman(_feed.message))}{' '}</>
                    )}

                    <br /> 
                    {setCountPost(index+1)}
                    <Divider />       
                    </>)}
                </>
            )}
             </Table.Cell>
            </Table.Row>
        </Table>
        </div>   
      </div>)
          } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Social Data')}</Card>
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
        />
      <ShowFeed />
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
export default React.memo(PaidFeedDetails);
