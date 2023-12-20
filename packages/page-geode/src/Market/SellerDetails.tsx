// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
//import React, { useState } from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, Toggle, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Divider, Message, Item, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import AccountHeader from '../shared/AccountHeader';
import { useToggle } from '@polkadot/react-hooks';
import CallSendMessage from './CallSendMessage';

import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    //onClose: () => void;
  }
  
  type Discussion = {
    messageId: string,
    fromAcct: string,
    toAcct: string,
    orderId: string,
    message: string,
    mediaUrl: string,
    timestamp: number
  }

  type Review = {
    reviewId: string,
    accountId: string,
    reviewer: string,
    rating: number,
    review: string,
    timestamp: number
  }

  type Seller = {
    sellerAccount: string,
    sellerName: string,
    storeDescription: string,
    sellerLocation: string,
    memberSince: number,
    bannerUrl: string,
    youtubeUrl: string,
    externalLink: string,
    reviewAverage: number,
    reviewCount: number,
    reviews: Review[],
    totalOrders: number,
    totalDelivered: number,
    totalDamaged: number,
    totalWrong: number,
    totalNotReceived: number,
    totalResolved: number,
    totalRefused: number
  }
  
  type CurrentOrders = {
    // todo - need type structure of Current Orders
    orderId: string,
    cartId: string,
    orderTimestamp: number,
    buyer: string,
    seller: string,
    image: string,
    itemId: string,
    itemName: string,
    quantity: number,
    priceEach: number,
    totalOrderPrice: number,
    deliverToAddress: string,
    deliverToAccount: string,
    trackingInfo: string,
    orderStatus: number,
    timeDelivered: number,
    discussion: Discussion[],
    resolution: number,
    zenoTotal: number,
    zenoBuyers: string[]
  }

//   type Reviews = {
//     // todo - type structure of reviews
//     submitted: string
//   }

  type Products = {
    productId: string,
    digital: boolean,
    title: string,
    price: number,
    brand: string,
    category: string,
    sellerAccount: string,
    sellerName: string,
    description: string,
    reviewAverage: number,
    reviewCount: number,
    reviews: Review[],
    inventory: number,
    photoOrYoutubeLink1: string,
    photoOrYoutubeLink2: string,
    photoOrYoutubeLink3: string,
    moreInfoLink: string,
    deliveryInfo: string,
    productLocation: string,
    digitalFileUrl: string,
    zenoPercent: string,
    zenoBuyers: string[]
  }

  type Services = {
    serviceId: string,
    online: boolean,
    title: string,
    price: number,
    category: string,
    sellerAccount: string,
    sellerName: string,
    description: string,
    reviewAverage: number,
    reviewCount: number,
    reviews: Review[],
    inventory: number,
    photoOrYoutubeLink1: string,
    photoOrYoutubeLink2: string,
    photoOrYoutubeLink3: string,
    bookingLink: string,
    serviceLocation: string,
    zenoPercent: number,
    zenoBuyers: string[]
  }

  type SellerObj = {
    seller: Seller,
    currentOrders: CurrentOrders[],
    products: Products[],
    services: Services[]
  }

  type ProfileDetail = {
  ok: SellerObj
  }
  
function SellerDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');
    const hextoHuman = (_hexIn: string) => (isHex(_hexIn)? t<string>(hexToString(_hexIn).trim()): '');
    const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
    const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    const numCheck = (_num: number) => (_num>-1 ? _num: 0);
    const rateCheck = (_num: number) => ((_num>-1 && _num<6)? _num: 0);
    const dateCheck = (_num: number) => (_num>0? timeStampToDate(_num): t('No Date'));
    const rating: string[] = ['','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];
    //let total: number = 0;

    const numToStatus: string[] = 
    ['Order Received','Shipped','Delivered','Problem (broken)','Refunded',
     'Replaced','Problem Denied','','','',
     '','','','',''];

    const numToProblem: string[] = 
     ['None','Broken','Wrong Item','Missing Parts',
      'Damaged','','','','',
      '','','','',''];

    const numToResolution: string[] =
    ['None','Unresolved','Resolved','','',''];


    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');

    const [count, setCount] = useState(0);
    const [isShowInfo, toggleShowInfo] = useToggle(false);
    const [isBuyerOrders, toggleBuyerOrders] = useToggle(false);
    const [isMyProducts, toggleMyProducts] = useToggle(false);
    const [isMyServices, toggleMyServices] = useToggle(false);

    const [isUpdateProduct, setUpdateProduct] = useState(false);
    const [isUpdateService, setUpdateService] = useState(false);
    const [isUpdateTracking, setUpdateTracking] = useState(false);
    const [isIssueRefund, setIssueRefund] = useState(false);
    const [isReplacement, setReplacement] = useState(false);
    const [isDenyRequest, setDenyRequest] = useState(false);
    const [isRateBuyer, setRateBuyer] = useState(false);
    const [isMessageBuyer, setMessageBuyer] = useState(false);
   // const [_rating, setRating] = useState(0);

    const _reset = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeProductUpdate = useCallback(
      () => {setUpdateProduct(true);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeServiceUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(true);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeTrackingUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(true);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeIssueRefundUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(true);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeReplacementUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(true);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeDenyRequestUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(true);
             setRateBuyer(false);
             setMessageBuyer(false);
            },
      []
    )

    const _makeRateBuyerUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(true);
             setMessageBuyer(false);
            },
      []
    )

    const _makeMessageBuyerUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(true);
            },
      []
    )

    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t<string>(str)}</>)
    }

    function accountInfo(_acct: string): JSX.Element {
        return(<>
            <IdentityIcon value={_acct}/>
            <AccountName value={_acct} withSidebar={true}/>{' | '}
            {acctToShort(_acct)}{' '}
            <CopyInline value={_acct} label={''}/>
        </>)
    }
    
    function photoLink(_url: string, _title: string): JSX.Element {
        return(<>
        {_url.length>2 &&
                  <Label as='a' color='orange' circular
                  href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
                  target="_blank" 
                  rel="noopener noreferrer">{_title}</Label> 
                  }
        </>)
    }

    function showPhoto(_url: string): JSX.Element {
      // {withHttp(hexToString(_url).trim())==='https:www.yuoutube.com'? }
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

    function imageShow(_url: string): JSX.Element {
        return(<>
                     <Image     as='a' 
                                size='massive' 
                                inline={true}
                                src={hextoPhoto(_url)} 
                                avatar 
                                href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
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
     
  function idNumberShort(_id: string): JSX.Element {return(<>{acctToShort(_id)}{' '}<CopyInline value={_id} label={''}/></>)}
  function t_strong(_str: string): JSX.Element{return(<><strong>{t<string>(_str)}</strong></>)}
  function withCopy(_str: string): JSX.Element {return(<>{_str}{' '}<CopyInline value={_str} label={''}/></>)}

  function withHelp(_str: string, _help: string): JSX.Element {
      return(<>
      <LabelHelp help={t<string>(_help)} />
      {' '}{t<string>(_str)}
      </>)
  }

  function numBadge(_num: number): JSX.Element {
    return(<>
      <Label circular size='small' color='blue'>
        {numCheck(_num)}
      </Label>
    </>)
  }

  function messageText(_msg: string, _bfrom: boolean): JSX.Element {
    return(<>
    {_bfrom? 
      <Label circular size='small' color='blue' pointing='left'>{hextoHuman(_msg)}</Label> :
      <Label circular size='small' color='grey' pointing='right'>{hextoHuman(_msg)}</Label>
    }
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
        //const _bannerUrl: string = (isHex(profileDetail.ok.seller.bannerUrl) ? withHttp(hexToString(profileDetail.ok.seller.bannerUrl).trim()) : defaultImage);
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>

              <Grid columns={2} divided>
                <Grid.Row>
                <Grid.Column>
                <h2><strong>
                    <i>{t<string>('Seller Account: ')}</i></strong><br />
                    <strong>{isHex(profileDetail.ok.seller.sellerName) ? 
                                autoCorrect(searchWords, hexToString(profileDetail.ok.seller.sellerName)) 
                                : ' '}</strong>
                    {imageShow(profileDetail.ok.seller.bannerUrl)}
                    <br />
                    {photoLink(profileDetail.ok.seller.youtubeUrl,'YouTube')}
                    {photoLink(profileDetail.ok.seller.externalLink, 'More Info')}      
                    <br />              
                    {t_strong('Account ID: ')}{accountInfo(profileDetail.ok.seller.sellerAccount)}<br />
                    {t_strong('Seller Rating: ')}{rating[rateCheck(profileDetail.ok.seller.reviewAverage)]}<br />
                    {t_strong('Number of Reviews: ')}{numBadge(profileDetail.ok.seller.reviewCount)}<br />
                    {t_strong('Store Description: ')}{hextoHuman(profileDetail.ok.seller.storeDescription)}<br />
                    {t_strong('Member since: ')}{dateCheck(profileDetail.ok.seller.memberSince)}<br />
                    {t_strong('Location: ')}{hextoHuman(profileDetail.ok.seller.sellerLocation)}<br />
                    <br />
                    {profileDetail.ok.seller.reviews.length>0 && <>
                      <Expander 
                      className='sellerReviews'
                      isOpen={false}
                      summary={<Label size={'small'} color='orange' circular> {t<string>('Seller Reviews: ')}</Label>}>
                      {t_strong('Seller Reviews: ')}<br />
                      {profileDetail.ok.seller.reviews.length>0 && profileDetail.ok.seller.reviews.map((_review, index: number) => <>
                                {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br /></>)
                      }
                    </Expander>                    
                    </>}
                    <br />
                    </h2>
                </Grid.Column>
                <Grid.Column>
                <h2>
                    {t_strong('Reviews from Buyers: ')}{profileDetail.ok.seller.reviews.length}<br />
                    {t_strong('Total Orders: ')}{profileDetail.ok.seller.totalOrders}<br />
                    {t_strong('Total Delivered: ')}{profileDetail.ok.seller.totalDelivered}<br />
                    {t_strong('Total Damaged: ')}{profileDetail.ok.seller.totalDamaged}<br />
                    {t_strong('Total Not Received: ')}{profileDetail.ok.seller.totalNotReceived}<br />
                    {t_strong('Total Refused: ')}{profileDetail.ok.seller.totalRefused}<br />
                    {t_strong('Total Resolved: ')}{profileDetail.ok.seller.totalResolved}<br />
                    {t_strong('Total Wrong: ')}{profileDetail.ok.seller.totalWrong}<br />                
                </h2>
                </Grid.Column>
                </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Cell verticalAlign='top'>
                <h2><strong><i>{(withHelp('Buyer Orders: ', ' Your Current Orders. '))}</i></strong>
                <Label color='blue' circular size='small'><strong>{profileDetail.ok.currentOrders.length}</strong></Label>
                </h2>
                {profileDetail.ok.currentOrders.length>0 ? <>
                <Toggle className='info-toggle'
                            label={<strong>{t<string>('Show Buyer Orders: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleBuyerOrders()}
                                           {_reset()}
                                           </>}}
                            value={isBuyerOrders}
                />
                {isBuyerOrders && <>
                {profileDetail.ok.currentOrders.length>0 && profileDetail.ok.currentOrders.map(_order => <>
                <Message>
                <Item.Group>
                        <Item>  
                            <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_order.image)} 
                                rounded 
                                href={isHex(_order.image) ? withHttp(hexToString(_order.image).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            />                           
                            <Item.Content>
                                <Item.Header as='a'>{hextoHuman(_order.itemName)}<br /><br />
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeTrackingUpdate()}</>}}
                                >{'Update Tracking'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeIssueRefundUpdate()}</>}}
                                >{'Issue Refund'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeReplacementUpdate()}</>}}
                                >{'Replacement'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeDenyRequestUpdate()}</>}}
                                >{'Deny Request'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.deliverToAccount)}
                                               {setUsername(_order.buyer)}
                                               {setCount(count + 1)}
                                               {_makeRateBuyerUpdate()}</>}}
                                >{'Rate Buyer'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeMessageBuyerUpdate()}</>}}
                                >{'Message Buyer'}</Label>
                                </Item.Header>
                                <Item.Meta><h3><strong>{'Quantity Ordered: '}</strong>
                                <Label color='blue' circular size='large'><strong>{_order.quantity}</strong></Label></h3></Item.Meta>
                                <Item.Description>
                                    {t_strong('Buyer Account: ')}{accountInfo(_order.buyer)}<br />
                                    {t_strong('Ship To Account: ')}{accountInfo(_order.deliverToAccount)}<br />
                                    {t_strong('Ship To Address: ')}{withCopy(hextoHuman(_order.deliverToAddress))}<br />
                                    {t_strong('Status: ')}{numToStatus[numCheck(_order.orderStatus)]}<br />
                                    {t_strong('Order Date: ')}{_order.orderTimestamp>0? timeStampToDate(_order.orderTimestamp): t('No date available.')}<br />
                                    {t_strong('Delivery Date: ')}{_order.timeDelivered>0? timeStampToDate(_order.timeDelivered): t('No date available.')}<br />
                                    {_order.discussion.length>0 && <>
                                      {t_strong('Messages: ')}{numBadge(_order.discussion.length)}
                                        <Expander 
                                        className='detail-expander'
                                        isOpen={false}
                                        summary={<Label size={'small'} color='orange' circular> {t<string>('View: ')}</Label>}>
                                            {_order.discussion.length>0 && _order.discussion.map((_message, index: number)=> <>
                                            {_order.seller===_message.fromAcct? 
                                              <>
                                              {timeStampToDate(_message.timestamp)}{': '}{accountInfo(_message.fromAcct)}{messageText(_message.message, true)}<br />
                                              </>:
                                              <>
                                              {timeStampToDate(_message.timestamp)}{': '}{messageText(_message.message, false)}{accountInfo(_message.fromAcct)}<br />
                                              </>}
                                            </>)}
                                      </Expander>      
                                      </>}                               
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='message'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('Details')}</Label>}>
                                      <Grid columns={2} divided>
                                        <Grid.Column>                                          
                                          {t_strong('Order Id: ')}{idNumberShort(_order.orderId)}<br />                                      
                                          {t_strong('Item ID: ')}{idNumberShort(_order.itemId)}<br />
                                          {t_strong('Resolution: ')}{numToResolution[numCheck(_order.resolution)]}<br />
                                          {t_strong('Tracking Info: ')}{hextoHuman(_order.trackingInfo)}<br />
                                          {t_strong('Price Each: ')}{microToGeode(_order.priceEach)}{t(' Geode')}<br />
                                          {t_strong('Total Price: ')}{microToGeode(_order.totalOrderPrice)}{t(' Geode')}<br />
                                          {t_strong('Quantity Ordered: ')}{_order.quantity}<br />
                                          {t_strong('Zeno Percent: ')}{microToGeode(_order.zenoTotal)}{t(' Geode')}<br />                                         
                                        </Grid.Column>
                                        <Grid.Column>
                                          {renderLink(_order.image)} 
                                        </Grid.Column>
                                      </Grid>    
                                    </Expander>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Message>
                </>)}                               
                </>}
                </>: t('You have no orders.')}
                <Divider />
                <h2><strong><i>{withHelp('My Products: ', ' Your Products currently being offered. ')}</i></strong>
                {numBadge(profileDetail.ok.products.length)}
                </h2>
                {profileDetail.ok.products.length>0? <>
                  <Toggle className='info-toggle' label={<strong>{t<string>('Show My Products: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleMyProducts()}
                                           {_reset()}
                                           </>}}
                            value={isMyProducts}
                />
                {isMyProducts && <>
                  {profileDetail.ok.products.length>0 && profileDetail.ok.products.map((_product)=> <>
                <Message>
                    <Item.Group>
                    <Item>
                    <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_product.photoOrYoutubeLink1)} 
                                rounded 
                                href={isHex(_product.photoOrYoutubeLink1) ? withHttp(hexToString(_product.photoOrYoutubeLink1).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
                    <Item.Content>
                                <Item.Header as='a'>{'Product: '}
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeProductUpdate()}</>}}
                                >{'Update'}</Label>
                                {photoLink(_product.moreInfoLink, 'More Info')}
                                </Item.Header>
                                <Item.Meta>
                                    <h3><strong>{hextoHuman(_product.title)}</strong></h3>
                                </Item.Meta>
                                <Item.Description>
                                  {t_strong('Product Rating: ')}{rating[rateCheck(_product.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_product.reviewCount)}<br />
                                  {t_strong('Description: ')}{hextoHuman(_product.description)}<br />
                                  {t_strong('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
                                  {t_strong('Product ID: ')}{idNumberShort(_product.productId)}<br />
                                  <Expander 
                                    className='productReviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('Reviews: ')}</Label>}>
                                    <strong>{t<string>('Reviews: ')}</strong><br />
                                      {_product.reviews.length>0 && 
                                      _product.reviews.map((_review, index: number)=> <>
                                          <Label circular color='blue' size='tiny'>{index+1}</Label>
                                          {' '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='product-details'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('View Details: ')}</Label>}>
                                      <Grid columns={2} divided>
                                        <Grid.Column>
                                          {t_strong('Product Details: ')}<br />
                                          {t_strong('Seller Account: ')}{accountInfo(_product.sellerAccount)}<br />
                                          {t_strong('Seller Name: ')}{hextoHuman(_product.sellerName)}<br />
                                          {t_strong('Location: ')}{hextoHuman(_product.productLocation)}<br />
                                          {t_strong('Brand: ')}{hextoHuman(_product.brand)}<br />
                                          {t_strong('Category: ')}{hextoHuman(_product.category)}<br />
                                          {t_strong('Inventory: ')}{_product.inventory}<br />
                                          {t_strong('Delivery Info: ')}{hextoHuman(_product.deliveryInfo)}<br />
                                          {t_strong('Zeno Percent: ')}{_product.zenoPercent}<br />
                                          {t_strong('Digital Product: ')}{boolToHuman(_product.digital)}<br />
                                          {_product.digital && <>
                                            {t_strong('File Url: ')}{' '}{ photoLink(_product.digitalFileUrl, 'Link')}<br />
                                          </>}
                                        </Grid.Column>
                                        <Grid.Column>
                                            {renderLink(_product.photoOrYoutubeLink1)}<br />
                                            {renderLink(_product.photoOrYoutubeLink2)}<br />
                                            {renderLink(_product.photoOrYoutubeLink3)}<br />
                                        </Grid.Column>
                                      </Grid>
                                    </Expander>
                                </Item.Extra>
                            </Item.Content>
                    </Item>
                    </Item.Group>
                </Message>
                </>)}                
                </>}
                </>:t('No Products for this Seller.')}
                <Divider />
                <h2><strong><i>{withHelp('My Services: ', ' Your Services currently being offered. ')}</i></strong>
                {numBadge(profileDetail.ok.services.length)}
                </h2>
                {profileDetail.ok.services.length>0? <>
                  <Toggle className='info-toggle' label={<strong>{t<string>('Show My Services: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleMyServices()}
                                           {_reset()}
                                           </>}}
                            value={isMyServices}
                />
                {isMyServices && <>
                  {profileDetail.ok.services.length>0 && profileDetail.ok.services.map((_services)=> <>
                <Message>
                    <Item.Group>
                    <Item>
                    <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_services.photoOrYoutubeLink1)} 
                                rounded 
                                href={isHex(_services.photoOrYoutubeLink1) ? withHttp(hexToString(_services.photoOrYoutubeLink1).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
                    <Item.Content>
                                <Item.Header as='a'>{'Service: '}
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_services.serviceId)}
                                               {setUsername(_services.title)}
                                               {setCount(count + 1)}
                                               {_makeProductUpdate()}</>}}
                                >{'Update'}</Label>
                                {photoLink(_services.bookingLink, 'Booking Link')}
                                </Item.Header>
                                <Item.Meta>
                                    <h3><strong>{hextoHuman(_services.title)}</strong></h3>
                                </Item.Meta>
                                <Item.Description>
                                  {t_strong('Product Rating: ')}{rating[rateCheck(_services.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_services.reviewCount)}<br />
                                  {t_strong('Description: ')}{hextoHuman(_services.description)}<br />
                                  {t_strong('Price: ')}{microToGeode(_services.price)}{' Geode'}<br />
                                  {t_strong('Service ID: ')}{idNumberShort(_services.serviceId)}<br />
                                  {_services.reviews.length>0 && <>
                                    <Expander 
                                    className='service-Reviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('Reviews: ')}</Label>}>
                                    <strong>{t<string>('Reviews: ')}</strong><br />
                                      {_services.reviews.length>0 && 
                                      _services.reviews.map((_review, index: number)=> <>
                                          <Label circular color='blue' size='tiny'>{index+1}</Label>
                                          {' '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>                                  
                                  </>}
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='service-details'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('View Details: ')}</Label>}>
                                      <Grid columns={2} divided>
                                        <Grid.Column>
                                          {t_strong('Service Details: ')}<br />
                                          {t_strong('Seller Account: ')}{accountInfo(_services.sellerAccount)}<br />
                                          {t_strong('Seller Name: ')}{hextoHuman(_services.sellerName)}<br />
                                          {t_strong('Location: ')}{hextoHuman(_services.serviceLocation)}<br />
                                          {t_strong('Category: ')}{hextoHuman(_services.category)}<br />
                                          {t_strong('Inventory: ')}{_services.inventory}<br />
                                          {t_strong('Zeno Percent: ')}{_services.zenoPercent}<br />
                                          {t_strong('Online Service: ')}{boolToHuman(_services.online)}<br />
                                        </Grid.Column>
                                        <Grid.Column>
                                            {renderLink(_services.photoOrYoutubeLink1)}<br />
                                            {renderLink(_services.photoOrYoutubeLink2)}<br />
                                            {renderLink(_services.photoOrYoutubeLink3)}<br />
                                        </Grid.Column>
                                      </Grid>
                                    </Expander>
                                </Item.Extra>
                            </Item.Content>
                    </Item>
                    </Item.Group>
                </Message>
                </>)}                
                </>}
                </>:t('No Services for this Seller.')}
            </Table.Cell>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Seller Data')}</Card>
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
        {isUpdateTracking && (<>
        <CallSendMessage
                callIndex={19}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isIssueRefund && (<>
        <CallSendMessage
                callIndex={21}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isReplacement && (<>
        <CallSendMessage
                callIndex={22}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDenyRequest && (<>
        <CallSendMessage
                callIndex={23}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isMessageBuyer && (<>
        <CallSendMessage
                callIndex={24}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRateBuyer && (<>
        <CallSendMessage
                callIndex={25}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isUpdateProduct && (<>
        <CallSendMessage
                callIndex={27}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isUpdateService && (<>
        <CallSendMessage
                callIndex={29}
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
export default React.memo(SellerDetails);
