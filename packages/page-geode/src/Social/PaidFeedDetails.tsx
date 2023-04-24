// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
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
//import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    isShowEndorsers: boolean;
    isShowInterest: boolean;
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
  
function PaidFeedDetails ({ className = '', onClear, isShowEndorsers, isShowInterest, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    //const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    //const interestWords: string[] = JSONSocialInterests;
    //const [isReply, toggleReply] = useToggle(true);

    //const isReply: boolean = true;
    //const isReplyToReply: boolean = false;

    //const [feedIndex, setFeedIndex] = useState(0);
    const [countPost, setCountPost] = useState(0);

    //const isShowBlockedAccounts: boolean = true;
    const [isShowBlockedAccounts, toggleShowBlockedAccounts] = useToggle(false);
    const [isShowMyInterest, toggleShowInterest] = useToggle(false);
    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    //const isShowMsgId: boolean = true;

    // example objects      'myInrests': '0x2344424'
    //{"ok":{"maxfeed":15,"myinterests":"0x646f67732c206172742c206d6f746f726379636c65732c20666f6f64","blocked":[],"mypaidfeed":[]}}
    let _Obj: Object = { "ok": {"maxfeed": 10, "myinterests":"0x646f67732c206172742c206d6f746f726379636c65732c20666f6f64", "blocked": ["5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy"], "mypaidfeed": [ { "messageId": "0x09d3adb1294121426054d65b1535ccbdcebc44220b8304360aeddbeb5d448eac", "replyTo": "0x0000000000000000000000000000000000000000000000000000000000000000", "fromAcct": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw", "username": "Nala the Wonder Dog", "message": "More Free Puppies, Buy One get Two FREE!", "link": "https://dogsbestlife.com/wp-content/uploads/2022/09/french-bulldog-puppy-scaled.jpeg", "endorserCount": 0, "timestamp": 1682109894001, "paidEndorserMax": 10, "endorserPayment": 100000000000000, "targetInterests": "dogs", totalStaked: 1000000000000000, "endorsers": [ "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw" ] } ] } }
    //let _Obj: Object = {"ok": {"maxfeed":10, "blocked":["5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL","5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"], "myfeed": [ {"messageId":"0xb92283bc2400d530a60ee0cd73a992ce73d72af846608205d51427ba55be72af","replyTo":"0x0000000000000000000000000000000000000000000000000000000000000000","fromAcct":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","username":"0x426f62","message":"0x466972737420706f7374","link":"0x68747470733a2f2f6d656469612e6973746f636b70686f746f2e636f6d2f69642f313330333433363033322f70686f746f2f6672656e63682d62756c6c646f672d6f6e2d7468652d67726173732d696e2d7468652d7061726b2d62656175746966756c2d646f672d62726565642d6672656e63682d62756c6c646f672d696e2d617574756d6e2d6f7574646f6f722e6a70673f623d3126733d3137303636376126773d30266b3d323026633d5a574f4b4f624133665939685756512d53505472454b53534c4f5577626442347168567a6a3749633773383d","endorserCount":0,"replyCount":0,"timestamp":1681657752005,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]},{"messageId":"0xc76570158d247a1907b01ced4ea2ba29a8c6bff29165d85ca1183e0a35b1fe35","replyTo":"0x0000000000000000000000000000000000000000000000000000000000000000","fromAcct":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","username":"0x426f62","message":"0x5365636f6e6420506f7374","link":"0x68747470733a2f2f74342e667463646e2e6e65742f6a70672f30302f39322f30342f38392f3336305f465f39323034383937395f4d50735a3074466c686477436653515a53463541554979476e30696f7a447a422e6a7067","endorserCount":0,"replyCount":0,"timestamp":1681657794005,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]}}
    const objOutput: string = stringify(output);
    _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    //console.log(Object.values(feedDetail.ok.myFeed.messageId.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{})))
    
    //[...new Set(feedDetail)];

    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t<string>(str)}</>)
    }

    function timeStampToDate(tstamp: number): JSX.Element {
       // const event = new Date(1681657752005);
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

    function ListAccount(): JSX.Element {
      try {
        return (
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
                </Table.Cell>
                <Table.Cell>
                <IdentityIcon value={from} />
                <AccountName value={from} withSidebar={true}/>
                <LabelHelp help={t<string>(' The account calling the information.')} /> 
                </Table.Cell>
      
                <Table.Cell>
                <strong>{t<string>('Date/Time: ')}</strong>
                {' '}{when.toLocaleDateString()} 
                {' '}{when.toLocaleTimeString()} 
                </Table.Cell>
                <Table.Cell>
                <strong>{t<string>(' Key: ')}</strong>
                {t<string>(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>  
                {t<string>(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t<string>(' Copy Message ID: ')}
                <CopyInline value={' '} label={''}/>
                </Table.Cell>
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
        )
      } catch(error) {
        console.error(error)
        //setIsClaim(false)
        return(
          <div>
          <Table>
            <Table.Row>
              <Table.Cell>
              <strong>{t<string>('There are no posts available.')}</strong>
              </Table.Cell>
              <Table.Cell>
              <strong>{t<string>('Date/Time: ')}</strong>
                {' '}{when.toLocaleDateString()} 
                {' '}{when.toLocaleTimeString()} 
              </Table.Cell>
            </Table.Row>
          </Table>
          </div>
        )
      }}


function ShowFeed(): JSX.Element {
    setCountPost(0)
    const maxIndex: number = feedDetail.ok.maxfeed;
    try {
        return(
          <div>
            <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {t<string>(' Number of Posts: ')}
                  <strong>{countPost}</strong>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Badge
                  icon='info'
                  color={(isShowMyInterest) ? 'blue' : 'gray'}
                  onClick={toggleShowInterest}/> 
                  {t<string>('Your Interests: ')}
                    
                  {isShowMyInterest && (<>{' ('}
                    {hextoHuman(feedDetail.ok.myinterests)}{') '}
                  </>)}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t<string>(' Number of Posts to show: ')}<strong>{feedDetail.ok.maxfeed}</strong><br />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {feedDetail.ok.blocked.length>0 && (
                  <>
                  <Badge
                  icon='info'
                  color={(isShowBlockedAccounts) ? 'blue' : 'gray'}
                  onClick={toggleShowBlockedAccounts}/> 
                  {t<string>(' Blocked: ')}<strong>{feedDetail.ok.blocked.length}</strong>
                  {isShowBlockedAccounts && (
                    <>
                    {feedDetail.ok.blocked.map(_blkd =>
                    <>{' ('}<AccountName value={_blkd} withSidebar={true}/>{') '}
                    </>)}<br />
                    </>
                  )}
                  </>)}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
                {feedDetail.ok.mypaidfeed
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
                    <h3> <strong>{'@'}</strong>
                         <strong>{(isHex(_feed.username)? hexToString(_feed.username).trim() : '')}</strong>
                              {' ('}<AccountName value={_feed.fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_feed.endorserCount}</Label>
                              {' '}{timeStampToDate(_feed.timestamp)}{' '}
                              <CopyInline value={_feed.messageId} label={''}/>
                     </h3>
                            <i><strong>{'Payment: '}{unitToGeode(_feed.endorserPayment)}{' Geode'}
                            {', Paid Endorsements Left: '}{_feed.paidEndorserMax-_feed.endorserCount}</strong></i>
                            <br />
                    {isShowEndorsers && _feed.endorserCount > 0 && (
                    <>
                    <List divided inverted >
                      {_feed.endorsers.map((name, i: number) => <List.Item key={name}> 
                        {(i > 0) && (<><Badge color='blue' icon='check'/>{t<string>('(endorser No.')}{i}{') '}
                        {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                        </>)}
                      </List.Item>)}
                    </List>     
                    </>
                    )}
                {isShowInterest && 
                      (<>
                      <br />{'Ad Target Interest: '}{hextoHuman(_feed.targetInterests)}
                      </>)} 
                <br />      
                {renderLink(_feed.link)}
                {(_feed.link != '0x') ? (
                <>
                    {(isHex(_feed.message)? (
                              <>
                              {hexToString(_feed.message).trim()}
                              </>
                              ) :'')}{' '}

                    <Label  as='a'
                    color='orange'
                    circular
                    href={isHex(_feed.link) ? withHttp(hexToString(_feed.link).trim()) : ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{t<string>('Link')}
                    </Label>{' '}
                    {isHex(_feed.link) ? (
                        <LabelHelp help={withHttp(hexToString(_feed.link).trim())} />
                        ) : ''}</>
                    ) : (
                    <>{(isHex(_feed.message)? hexToString(_feed.message).trim() :'')}{' '}</>
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
      <ListAccount />
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
