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
import { Toggle, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
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
  
  type Seller = {
    sellerAccount: string,
    sellerName: string,
    storeDescription: string,
    sellerLocation: string,
    memberSince: number,
    bannerUrl: string,
    youtubeUrl: string,
    externalLink: string,
    reviews: string[],
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
    orderTimeStamp: number,
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
    orderStatus: string,
    timeDelivered: number,
    discussion: string,
    resolution: string,
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
    reviews: string[],
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
    reviews: string[],
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

    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');

    const [count, setCount] = useState(0);
    const [isShowInfo, toggleShowInfo] = useToggle(false);
    const [isUpdateProduct, setUpdateProduct] = useState(false);
    const [isUpdateService, setUpdateService] = useState(false);

    const _reset = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
            },
      []
    )

    const _makeProductUpdate = useCallback(
      () => {setUpdateProduct(true);
             setUpdateService(false);
            },
      []
    )

    const _makeServiceUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(true);
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
            <AccountName value={_acct}/>
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
        const _bannerUrl: string = (isHex(profileDetail.ok.seller.bannerUrl) ? withHttp(hexToString(profileDetail.ok.seller.bannerUrl).trim()) : defaultImage);
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
                    <strong>{ isHex(profileDetail.ok.seller.sellerName) ? 
                                autoCorrect(searchWords, hexToString(profileDetail.ok.seller.sellerName)) 
                                : ' '}</strong>
                    {imageShow(profileDetail.ok.seller.bannerUrl)}
                    <br />
                    {photoLink(profileDetail.ok.seller.youtubeUrl,'YouTube')}
                    {photoLink(profileDetail.ok.seller.externalLink, 'Link')}      
                    <br />              
                    {t<string>('Account ID: ')}{accountInfo(profileDetail.ok.seller.sellerAccount)}<br />
                    {t<string>('Seller Rating: ')}{''}<br />
                    {t<string>('Member since: ')}{timeStampToDate(profileDetail.ok.seller.memberSince)}<br />
                    {t<string>('Location: ')}{hextoHuman(profileDetail.ok.seller.sellerLocation)}<br />
                    <br />
                    <Toggle
                                  className='info-toggle'
                                  label={<strong>{t<string>('Show Extra Info: ')}</strong>}
                                  onChange={()=> {<>
                                           {toggleShowInfo()}
                                           {_reset()}
                                           </>}}
                                  value={isShowInfo}
                                  />
                    </h2>
                </Grid.Column>
                <Grid.Column>
                <h2>
                    {t<string>('Reviews from Buyers: ')}{profileDetail.ok.seller.reviews.length}<br />
                    {t<string>('Total Orders: ')}{profileDetail.ok.seller.totalOrders}<br />
                    {t<string>('Total Delivered: ')}{profileDetail.ok.seller.totalDelivered}<br />
                    {t<string>('Total Damaged: ')}{profileDetail.ok.seller.totalDamaged}<br />
                    {t<string>('Total Not Received: ')}{profileDetail.ok.seller.totalNotReceived}<br />
                    {t<string>('Total Refused: ')}{profileDetail.ok.seller.totalRefused}<br />
                    {t<string>('Total Resolved: ')}{profileDetail.ok.seller.totalResolved}<br />
                    {t<string>('Total Wrong: ')}{profileDetail.ok.seller.totalWrong}<br />                
                </h2>
                </Grid.Column>
                </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Cell verticalAlign='top'>
                <h2><LabelHelp help={t<string>(' Your Current Orders. ')} />
                {' '}<strong><i>{t<string>('Orders: ')}</i></strong></h2>
                <Message>
                <Item.Group>
                        <Item>
                            <Item.Image size='tiny' src={_bannerUrl} rounded />                            
                            <Item.Content>
                                <Item.Header as='a'>{'No. of Orders: '}
                                <Label color='blue' circular size='large'><strong>{'4'}</strong></Label>
                                </Item.Header>
                                <Item.Meta>{t<string>('Product Title: ')}{'profileDetail.ok.currentOrders.title'}</Item.Meta>
                                <Item.Description>
                                    {t<string>('Buyer: ')}{'profileDetail.ok.currentOrders.buyer'}<br />
                                    {t<string>('ShipTo: ')}{'profileDetail.ok.currentOrders.shipTo'}<br />
                                </Item.Description>
                                <Item.Extra>{t<string>('Status: ')}
                                {t<string>('Shipped/Complete/Problem (broken)/Refunded/Replaced/Problem Denied')}</Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Message>
                <Divider />
                <h2><LabelHelp help={t<string>(' Your Products currently being offered. ')} />
                {' '}<strong><i>{t<string>('My Products: ')}</i></strong></h2>
                {profileDetail.ok.products.length>0 && 
                    profileDetail.ok.products.map((_product, index: number)=> <>
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
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeProductUpdate()}</>}}
                                >{'Update'}</Label>
                                {photoLink(_product.photoOrYoutubeLink1, 'Photo')}
                                {photoLink(_product.photoOrYoutubeLink2, 'Photo')}
                                {photoLink(_product.photoOrYoutubeLink3, 'Photo')}
                                {photoLink(_product.moreInfoLink, 'More Info')}
                                </Item.Header>
                                <Item.Meta>
                                    <h3><strong>{hextoHuman(_product.title)}</strong></h3>
                                </Item.Meta>
                                <Item.Description>
                                    {t<string>('Description: ')}{hextoHuman(_product.description)}<br />
                                    {t<string>('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
                                    {t<string>('Product ID: ')}{acctToShort(_product.productId)}
                                    {' '}<CopyInline value={_product.productId} label={''}/><br />
                                </Item.Description>
                                <Item.Extra>
                                  {isShowInfo && <>
                                    {t<string>('Seller Account: ')}{accountInfo(_product.sellerAccount)}<br />
                                    {t<string>('Seller Name: ')}{hextoHuman(_product.sellerName)}<br />
                                    {t<string>('Location: ')}{hextoHuman(_product.productLocation)}<br />
                                    {t<string>('Brand: ')}{hextoHuman(_product.brand)}<br />
                                    {t<string>('Category: ')}{hextoHuman(_product.category)}<br />
                                    {t<string>('Inventory: ')}{_product.inventory}<br />
                                    {t<string>('Delivery Info: ')}{hextoHuman(_product.deliveryInfo)}<br />
                                    {t<string>('Zeno Percent: ')}{_product.zenoPercent}<br />
                                    {t<string>('Digital Product: ')}{boolToHuman(_product.digital)}<br />
                                    {_product.digital && <>
                                    {t<string>('File Url: ')}{' '}{ photoLink(_product.digitalFileUrl, 'Link')}<br />
                                    </>}
                                  </>}
                                </Item.Extra>
                            </Item.Content>
                    </Item>
                    </Item.Group>
                </Message>
                </>)}
                <Divider />
                <h2><LabelHelp help={t<string>(' Your Services currently being offered. ')} />
                {' '}<strong><i>{t<string>('My Services: ')}</i></strong></h2>
                {profileDetail.ok.services.length>0 && 
                    profileDetail.ok.services.map((_service, index: number)=> <>
                <Message>
                    <Item.Group>
                    <Item>
                    <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_service.photoOrYoutubeLink1)} 
                                rounded 
                                href={isHex(_service.photoOrYoutubeLink1) ? withHttp(hexToString(_service.photoOrYoutubeLink1).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
                    <Item.Content>
                                <Item.Header as='a'>{'Service: '}
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_service.serviceId)}
                                               {setUsername(_service.title)}
                                               {setCount(count + 1)}
                                               {_makeServiceUpdate()}</>}}
                                >{'Update'}</Label>
                                {photoLink(_service.photoOrYoutubeLink1, 'Photo')}
                                {photoLink(_service.photoOrYoutubeLink2, 'Photo')}
                                {photoLink(_service.photoOrYoutubeLink3, 'Photo')}
                                {photoLink(_service.bookingLink, 'Book')}
                                </Item.Header>
                                <Item.Meta><h3><strong>{hextoHuman(_service.title)}</strong></h3></Item.Meta>
                                <Item.Description>
                                    {t<string>('Description: ')}{hextoHuman(_service.description)}<br />
                                    {t<string>('Price: ')}{microToGeode(_service.price)}{' Geode'}<br />
                                    {t<string>('Location: ')}{hextoHuman(_service.serviceLocation)}<br />
                                </Item.Description>
                                <Item.Extra>
                                {isShowInfo && <>
                                    {t<string>('Seller Account: ')}{accountInfo(_service.sellerAccount)}<br />
                                    {t<string>('Seller Name: ')}{hextoHuman(_service.sellerName)}<br />
                                    {t<string>('Category: ')}{hextoHuman(_service.category)}<br />
                                    {t<string>('Inventory: ')}{_service.inventory}<br />
                                    {t<string>('Online: ')}{boolToHuman(_service.online)}<br />
                                    {t<string>('Booking Link: ')}{photoLink(_service.bookingLink, 'Link')}<br />
                                </>}
                                </Item.Extra>
                            </Item.Content>
                    </Item>
                    </Item.Group>
                </Message>
                </>)}
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
