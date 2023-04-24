// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Button, Badge, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label, Image, Divider } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle } from '@polkadot/react-hooks';
//import JSONInterests from '../shared/geode_social_interest.json';
//import JSONprohibited from '../shared/geode_prohibited.json';
//import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type FeedDetail = {
  ok: string[];
  }
  
function StatDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    //const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    //const searchWords: string[] = JSONprohibited;
    //const interestWords: string[] = JSONInterests;
    const [isByUser, toggleByUser] = useToggle(true);
    const [isByFreq, toggleByFreq] = useToggle(false);
    const [isByGraph, toggleByGraph] = useToggle(false);
    const [isShowInfo, toggleShowInfo] = useToggle(false);
    
    //const interestWords: string[] = JSONSocialInterests;
    //const [isReply, toggleReply] = useToggle(true);

    //const isReply: boolean = true;
    //const isReplyToReply: boolean = false;

    //const [feedIndex, setFeedIndex] = useState(0);
    //const [countPost, setCountPost] = useState(0);

    //const isShowBlockedAccounts: boolean = true;
    // const [isShowBlockedAccounts, toggleShowBlockedAccounts] = useToggle(false);
    // const [isShowMyInterest, toggleShowInterest] = useToggle(false);
    //const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    //const isShowMsgId: boolean = true;

    // example objects      'myInrests': '0x2344424'
    //{"ok":{"maxfeed":15,"myinterests":"0x646f67732c206172742c206d6f746f726379636c65732c20666f6f64","blocked":[],"mypaidfeed":[]}}
    
    //let _Obj: Object = { "ok": "dogs", "art", "boats", "airplanes", "dogs", "art", "boats", "flowers", "cars", "art, "boats", "flowers", "cars", "people", "art", "flowers", "cars", "art", "flowers", "cars", "dogs", "people", "art", "cars", "people", "art", "cars", "people", "dogs", "trees", "snacks", "cars", "people", "dogs", "trees", "snacks", "tables", "chairs" }
    //let _Obj: Object = { "ok": {"maxfeed": 10, "myinterests":"0x646f67732c206172742c206d6f746f726379636c65732c20666f6f64", "blocked": ["5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy"], "mypaidfeed": [ { "messageId": "0x09d3adb1294121426054d65b1535ccbdcebc44220b8304360aeddbeb5d448eac", "replyTo": "0x0000000000000000000000000000000000000000000000000000000000000000", "fromAcct": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw", "username": "Nala the Wonder Dog", "message": "More Free Puppies, Buy One get Two FREE!", "link": "https://dogsbestlife.com/wp-content/uploads/2022/09/french-bulldog-puppy-scaled.jpeg", "endorserCount": 0, "timestamp": 1682109894001, "paidEndorserMax": 10, "endorserPayment": 100000000000000, "targetInterests": "dogs", totalStaked: 1000000000000000, "endorsers": [ "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw" ] } ] } }
    //let _Obj: Object = {"ok": {"maxfeed":10, "blocked":["5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL","5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"], "myfeed": [ {"messageId":"0xb92283bc2400d530a60ee0cd73a992ce73d72af846608205d51427ba55be72af","replyTo":"0x0000000000000000000000000000000000000000000000000000000000000000","fromAcct":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","username":"0x426f62","message":"0x466972737420706f7374","link":"0x68747470733a2f2f6d656469612e6973746f636b70686f746f2e636f6d2f69642f313330333433363033322f70686f746f2f6672656e63682d62756c6c646f672d6f6e2d7468652d67726173732d696e2d7468652d7061726b2d62656175746966756c2d646f672d62726565642d6672656e63682d62756c6c646f672d696e2d617574756d6e2d6f7574646f6f722e6a70673f623d3126733d3137303636376126773d30266b3d323026633d5a574f4b4f624133665939685756512d53505472454b53534c4f5577626442347168567a6a3749633773383d","endorserCount":0,"replyCount":0,"timestamp":1681657752005,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]},{"messageId":"0xc76570158d247a1907b01ced4ea2ba29a8c6bff29165d85ca1183e0a35b1fe35","replyTo":"0x0000000000000000000000000000000000000000000000000000000000000000","fromAcct":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","username":"0x426f62","message":"0x5365636f6e6420506f7374","link":"0x68747470733a2f2f74342e667463646e2e6e65742f6a70672f30302f39322f30342f38392f3336305f465f39323034383937395f4d50735a3074466c686477436653515a53463541554979476e30696f7a447a422e6a7067","endorserCount":0,"replyCount":0,"timestamp":1681657794005,"endorsers":["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]}]}}
    //{"ok":["0x636f77732c20646f67732c20686f727365732c2062697264732c20737175697272656c73","0x646f67732c20707570706965732c20736e61636b732c20737175697272656c732c206172742c206d757365756d732c2074726565732c2077616c6b73","0x646f67732c206172742c20726f626f74732c2041492c20746563686e6f6c6f67792c2064726f6e65732c20626c6f636b636861696e2c2073706163652c20617374726f6e6f6d79","0x6172742c2074726565732c206f7574646f6f72732c2063616d70696e672c2068696b696e672c2066697368696e672c207377696d6d696e6720696e206372797374616c206c616b65732c206d6f756e7461696e732c2063616d7020676561722c2063616d70696e67","0x736369656e63652c2063616d70696e672c206172742c20706879736963732c20656c656374726f6e6963732c2076616375756d207475626520616d706c6966696572732c207472616e736973746f72732c2064696f646573","0x6d6f746f726379636c65732c20686f7420726f64732c2066617420626f7920656e67696e65732c2062696b65206275696c64732c2062696b65732c20726964696e672c206861726c6579","0x737175697272656c732c20646f67732c2074726565732c20736e61636b732c20646f672062656473","0x737175697272656c732c20646f67732c2074726565732c20736e61636b732c20646f6720626564732c206d6f746f726379636c65732c20706879736963732c2076616375756d207475626573"]}
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    //const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
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

function hextoHuman(_hexIn: string): string {
        const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): ''
        return(_Out)
}

function removeDuplicates(arr: string[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function removeSpaces(arr: string[]) {
  return arr.map(_w => (_w.trim()))
}

function ShowStat(): JSX.Element {
    try {
    const maxIndex: number = feedDetail.ok.length;
    const modArr: string[] = (feedDetail.ok.map(_w => hextoHuman(_w).trimStart() + ', ')).concat();
    const strArr: string = JSON.stringify(modArr.toString().split(','));
    const strObj: string[] = removeDuplicates(removeSpaces(JSON.parse(strArr)));
        return(
          <div>
            <div>
            <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                <>
                <Button
                  icon={(isByFreq) ? 'minus' : 'plus'}
                  label={t<string>(' By Frequency ')}
                  onClick={toggleByFreq}
                />
                <Button
                  icon={(isByUser) ? 'minus' : 'plus'}
                  label={t<string>(' By User ')}
                  onClick={toggleByUser}
                />
                <Button
                  icon={(isByGraph) ? 'minus' : 'plus'}
                  label={t<string>(' Graph ')}
                  onClick={toggleByGraph}
                />
 
                </>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
              <strong>{'Interest Word Analysis :'}</strong>{('Select Analysis Above')}<br /><br />
              {'(1) Total Number of Users In Data: ' } <strong>{maxIndex}</strong><br />
              {'(2) Total Number of Unique Words/Phrases: '}<strong>{strObj.length}</strong><br /><br />
              {isByUser && (
                  <>
                  <br />
                  <Badge color='blue' icon='thumbs-up'/>
                  <Badge
                    icon='info'
                    color={(isShowInfo) ? 'blue' : 'gray'}
                    onClick={toggleShowInfo}/> 

                  <strong>{'Interest Words by User Accounts:'}</strong><br /><br />
                  {isShowInfo && (
                    <>
                    <CopyInline value={'copy'} label={''}/>
                    {'Use the Copy button to copy the Interest Words from individual Users.'}
                    <br /><br />
                    </>
                  )}
                  
                  {feedDetail.ok.map((_word, index: number) => 
                    <>
                    <CopyInline value={hextoHuman(_word)} label={''}/>
                    {hextoHuman(_word)}<br /><br />
                    </>)
                  }    
                <Divider />
              </>)}
              {isByGraph && (
                <>
                <Badge color='red' icon='thumbs-up'/>
                <Badge
                    icon='info'
                    color={(isShowInfo) ? 'blue' : 'gray'}
                    onClick={toggleShowInfo}/> 

                <strong>{'Graph Analysis to be added in future upgrade.'}</strong><br /><br />
                <Divider />
                </>
              )}
              {isByFreq && (
                <>
                <Badge color='blue' icon='thumbs-up'/>
                <Badge
                    icon='info'
                    color={(isShowInfo) ? 'blue' : 'gray'}
                    onClick={toggleShowInfo}/> 
                <strong>{'Frequency Analysis: '}</strong><br /><br />
                {isShowInfo && (
                    <>
                    <CopyInline value={'copy'} label={''}/>
                    {'Use the Copy button to copy the Interest Words from individual Users.'}
                    <br /><br />
                    </>
                  )}

                <strong>{'All Words: '}</strong>{modArr.map(_subWord => (
                  <>
                  {_subWord}
                  </>
                ))}<br /><br />
                <strong>{'Unique Words: '}</strong>
                {strObj.map((_word, index: number) => (
                  <>
                    {' "'}{_word}{'", '}
                  </>
                ))}
                <br /><br />
                {strObj.map((_word, index: number) => 
                    <>
                    {_word.trim()!='' && (
                        <div>
                        <CopyInline value={_word.trim()} label={''}/>
                        {strArr.split(_word.trim()).length - 1 > 0 ? (
                        <>
                        <strong>{_word.trim()}{': '}</strong>
                        <Label color='blue' circular>
                            {strArr.split(_word.trim()).length - 1}
                        </Label>
                        </>
                        ) : (
                        <>{_word.trim()}{': '}<strong>{0}</strong></>
                        )
                    }
                    <br />
                    </div>
                    )}
                    </>
                    )}
                <Divider />
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
      <ShowStat />
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
export default React.memo(StatDetails);
