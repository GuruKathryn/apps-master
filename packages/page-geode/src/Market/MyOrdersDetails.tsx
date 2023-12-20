// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Divider, Item, Message, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import AccountHeader from '../shared/AccountHeader';
//import { useToggle } from '@polkadot/react-hooks';
import CallSendMessage from './CallSendMessage';

//import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type Orders = {
    orderId: string,
    cartId: string,
    orderTimestamp: number,
    buyer: string,
    buyerRating: number,
    buyerRatingCount: number,
    seller: string,
    sellerName: string,
    image: string,
    itemId: string,
    itemName: string,
    quantity: number,
    priceEach: number,
    totalOrderPrice: number,
    deliveryToAddress: string,
    deliveryToAccount: string,
    trackingInfo: string,
    orderStatus: number,
    timeDelivered: number,
    discussion: string[],
    problem: number,
    resolution: number,
    zenoTotal: number
  }

  type OrderObj = {
    buyer: string,
    carts: Orders[]
  }

  type ProfileDetail = {
  ok: OrderObj
  }
  
function MyOrdersDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
//    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const [count, setCount] = useState(0);
    const [isRateItem, setRateItem] = useState(false);
    //const [isRateSeller, setRateSeller] = useState(false);
    const [isMessage, setMessage] = useState(false);
    const [isDamaged, setDamaged] = useState(false);
    const [isWrong, setWrong] = useState(false);
    const [isNotReceived, setNotReceived] = useState(false);

    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');


    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
    const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    //const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');
    const numCheck = (_num: number) => (_num>-1 ? _num: 0);
    const hextoHuman = (_hexIn: string) => (isHex(_hexIn)? t<string>(hexToString(_hexIn).trim()): '');
    //const strongText: JSX.Element = (_str: string) => {<><strong>{t<string>(_str)}</strong></>};
    const rateCheck = (_num: number) => ((_num>-1 && _num<6)? _num: 0);
    const rating: string[] = ['none','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];

    const numToStatus: string[] = 
    ['Processing Your Order','Shipped','Delivered','Problem (broken)','Refunded',
     'Replaced','Problem Denied','','','',
     '','','','',''];

    const numToProblem: string[] = 
     ['None','Broken','Wrong Item','Missing Parts',
      'Damaged','','','','',
      '','','','',''];

    const numToResolution: string[] =
    ['None','Unresolved','Resolved','','',''];
 
    const _reset = useCallback(
      () => {setRateItem(false);
             //setRateSeller(false);
             setMessage(false);
             setDamaged(false);
             setWrong(false);
             setNotReceived(false);
            },
      []
    )

    const _makeRateItemUpdate = useCallback(
      () => {setRateItem(true);
             //setRateSeller(false);
             setMessage(false);
             setDamaged(false);
             setWrong(false);
             setNotReceived(false);
            },
      []
    )

    const _makeMessageUpdate = useCallback(
        () => {setRateItem(false);
               //setRateSeller(false);
               setMessage(true);
               setDamaged(false);
               setWrong(false);
               setNotReceived(false);
              },
        []
      )
  
      const _makeDamagedUpdate = useCallback(
        () => {setRateItem(false);
               //setRateSeller(false);
               setMessage(false);
               setDamaged(true);
               setWrong(false);
               setNotReceived(false);
              },
        []
      )

      const _makeWrongUpdate = useCallback(
        () => {setRateItem(false);
               //setRateSeller(false);
               setMessage(false);
               setDamaged(false);
               setWrong(true);
               setNotReceived(false);
              },
        []
      )

      const _makeNotReceivedUpdate = useCallback(
        () => {setRateItem(false);
               //setRateSeller(false);
               setMessage(false);
               setDamaged(false);
               setWrong(false);
               setNotReceived(true);
              },
        []
      )

    // function autoCorrect(arr: string[], str: string): JSX.Element {
    //     arr.forEach(w => str = str.replaceAll(w, '****'));
    //     arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
    //     arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
    //     arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
    //     return (
    //     <>{t<string>(str)}</>)
    // }

  
  
    function _strong(_str: string): JSX.Element{
        return(<><strong>{t<string>(_str)}</strong></>)
    }

    // function photoLink(_url: string, _title: string): JSX.Element {
    //     return(<>
    //     {_url.length>2 &&
    //               <Label as='a' color='orange' circular
    //               href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
    //               target="_blank" 
    //               rel="noopener noreferrer">{_title}</Label> 
    //               }
    //     </>)
    // }

    function showPhoto(_url: string): JSX.Element {
      return(<>
      {_url.length>2 && 
      <> 
        <Image as='a' 
                  size='tiny' 
                  width={150}
                  height={150}
                  src={hextoPhoto(_url)} 
                  rounded 
                  href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
                  target="_blank" 
                  rel="noopener noreferrer"
      />      
      </>}
      </>)
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
          <iframe width="150" height="100" src={videoLink +'?autoplay=0&mute=1'}> 
          </iframe>) : (
          showPhoto(_link)
          )}    
        </>) : <>{''}</>}
        <br /></>
      )
    }
    

    function accountInfo(_acct: string): JSX.Element {
      return(<>
          <IdentityIcon value={_acct}/>{' | '}
          <AccountName value={_acct} withSidebar={true}/>{' | '}
          {acctToShort(_acct)}{' '}
          <CopyInline value={_acct} label={''}/>
      </>)
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

     function numBadge(_num: number): JSX.Element {
      return(<>
        <Label circular size='small' color='blue'>
          {numCheck(_num)}
        </Label>
      </>)
    }

    function withCopy(_str: string): JSX.Element {
      return(<>
      {_str}{' '}
      <CopyInline value={_str} label={''}/>
      </>)
  }

    function withHelp(_str: string, _help: string): JSX.Element {
      return(<>
      <LabelHelp help={t<string>(_help)} />
      {' '}{t<string>(_str)}
      </>)
  }

    function ListAccount(): JSX.Element {
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
      
      function ShowProfile(): JSX.Element {
        try {
          return(
            <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
              <Table.HeaderCell>
                <h2>
                    <strong>{t('Buyer: ')}</strong>{accountInfo(profileDetail.ok.buyer)}<br /><br />
                </h2>
              </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
              <Table.Cell verticalAlign='top'>
                  <h2><strong><i>{withHelp('Ordered Items: ', ' List of Items Ordered. ')}</i></strong></h2>
                  {profileDetail.ok.carts.length>0 && profileDetail.ok.carts.map(_cart => <>
                        {_strong('Buyer: ')}{accountInfo(_cart.buyer)}<br />
                        {_strong('Date Ordered: ')}{timeStampToDate(_cart.orderTimestamp)}<br />
                        {_strong('Delivery To: ')}{_cart.deliveryToAddress}<br />
                        {_strong('Delivery To Account: ')}{hextoHuman(_cart.deliveryToAccount)}<br />
                        {_strong('Buyer Rating: ')}{rating[rateCheck(_cart.buyerRating)]}<br />
                        {_strong('Number of Ratings: ')}{numBadge(_cart.buyerRatingCount)}<br />
                        {_strong('Cart Id: ')}{withCopy(acctToShort(_cart.cartId))}<br />
                        {_strong('Order Id: ')}{withCopy(acctToShort(_cart.orderId))}<br />
                            <Message>
                                <Item.Group>
                                <Item>
                                <Item.Image as='a' size='tiny' 
                                  src={hextoPhoto(_cart.image)} 
                                  rounded 
                                  href={isHex(_cart.image) ? withHttp(hexToString(_cart.image).trim()) : ''} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                /> 
                                <Item.Content>
                                  <Item.Header as='a'>{'Item: '}
                                  <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_cart.itemId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeRateItemUpdate()}</>}}
                                >{t('Rate Item')}</Label>
                                  <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_cart.itemId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeMessageUpdate()}</>}}
                                >{t('Message Seller')}</Label>
                                    <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_cart.itemId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeDamagedUpdate()}</>}}
                                >{t('Item Damaged')}</Label>
                                    <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_cart.orderId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeWrongUpdate()}</>}}
                                >{t('Wrong Item')}</Label>
                                    <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_cart.orderId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeNotReceivedUpdate()}</>}}
                                >{t('Not Received')}</Label>

                                  </Item.Header>
                                  <Item.Meta>
                                      <h2>{_strong(hextoHuman(_cart.itemName))}</h2>
                                  </Item.Meta>
                                  <Item.Description>
                                      <strong>{t<string>('Quantity: ')}</strong>
                                      <Label color='blue' circular size='large'>
                                            {_cart.quantity}
                                      </Label><br />
                                      {_strong('Price: ')}{microToGeode(_cart.priceEach)}{t(' Geode')}<br />
                                      {_strong('Total Order Price: ')}{microToGeode(_cart.totalOrderPrice)}{t(' Geode')}<br />
                                      {_strong('Seller Account: ')}{accountInfo(_cart.seller)}<br />
                                      {_strong('Seller Name: ')}{hextoHuman(_cart.sellerName)}<br />
                                      {_strong('Ordered on: ')}{timeStampToDate(_cart.orderTimestamp)}<br />
                                      {_strong('Status: ')}{numToStatus[numCheck(_cart.orderStatus)]}<br />
                                  </Item.Description>
                                  <Item.Extra>
                                  <Expander 
                                    className='extra-details'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('View Details')}</Label>}>
                                      <Grid columns={2} divided>
                                        <Grid.Column>
                                          {_strong('Deliver To Address: ')}{_cart.deliveryToAddress}<br />
                                          {_strong('Delivery To Account: ')}{_cart.deliveryToAccount}<br />                                          
                                          {_strong('Problems Identified: ')}{numToProblem[numCheck(_cart.problem)]}<br />
                                          {_strong('Resolution: ')}{numToResolution[numCheck(_cart.resolution)]}<br />
                                          {_strong('Tracking Info: ')}{hextoHuman(_cart.trackingInfo)}<br />
                                          {_strong('Delivery Date: ')}{_cart.timeDelivered>0? timeStampToDate(_cart.timeDelivered): t('Not Delivered Yet')}<br />
                                          {_strong('Zeno Total: ')}{microToGeode(_cart.zenoTotal)}{t(' Geode')}<br />
                                        </Grid.Column>
                                        <Grid.Column>
                                          {renderLink(_cart.image)}
                                        </Grid.Column>
                                      </Grid>
                                    </Expander>
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>
                  
                  </>)}
                    

                
                  <Divider />
        
              </Table.Cell>
        </Table>
        </div>   
        )
      } catch(e) {
        console.log(e);
        return(
          <div>
            <Card>{t<string>('No Order Data')}</Card>
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
            callFrom={99}/>
      <ListAccount />
      <ShowProfile />
      {isRateItem && (<>
        <CallSendMessage
                callIndex={7}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDamaged && (<>
        <CallSendMessage
                callIndex={9}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isWrong && (<>
        <CallSendMessage
                callIndex={10}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isNotReceived && (<>
        <CallSendMessage
                callIndex={11}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

        {isMessage && (<>
        <CallSendMessage
                callIndex={12}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

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
export default React.memo(MyOrdersDetails);
