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
import { Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Divider, Message, Item, Table, Label, Image } from 'semantic-ui-react'
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
  
  type Review = {
    reviewId: string,
    accountId: string,
    reviewer: string,
    rating: number,
    review: string,
    timestamp: number
  }

  type Owner = {
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
    //digitalFileUrl: string,
    zenoPercent: number,
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

  type Stores ={
    owner: Owner,
    products: Products[],
    services: Services[]
  }

  type SearchObj = {
    search: string,
    stores: Stores[]
  }

  type ProfileDetail = {
  ok: SearchObj
  }
  
function SearchByStoreDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    //const searchWords: string[] = JSONprohibited;

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
    const numToPercent = (_num: number) => ((_num>-1 && _num<=100)? _num.toString(): '0')+ ' %';
    const rating: string[] = ['','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];
//    let total: number = 0;

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
    // const [isShowInfo, toggleShowInfo] = useToggle(false);
    // const [isUpdateProduct, setUpdateProduct] = useState(false);
    // const [isUpdateService, setUpdateService] = useState(false);
    const [isBookmark, setBookmark] = useState(false);
    const [isAddToCart, setAddToCart] = useState(false);
    const [isAddToList, setAddToList] = useState(false);

    // const [isIssueRefund, setIssueRefund] = useState(false);
    // const [isReplacement, setReplacement] = useState(false);
    // const [isDenyRequest, setDenyRequest] = useState(false);
    // const [isRateBuyer, setRateBuyer] = useState(false);
    // const [isMessageBuyer, setMessageBuyer] = useState(false);
    //const [_rating, setRating] = useState(0);

    const _reset = useCallback(
      () => {   setBookmark(false);
                setAddToCart(false);
                setAddToList(false);
            },
      []
    )

    const _makeBookmarkUpdate = useCallback(
      () => {   setBookmark(true);
                setAddToCart(false);
                setAddToList(false);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
        () => { setBookmark(false);
                setAddToCart(true);
                setAddToList(false);
        },
      []
    )

    const _makeAddToListUpdate = useCallback(
        () => { setBookmark(false);
                setAddToCart(false);
                setAddToList(true);
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
      
    function t_strong(_str: string): JSX.Element{
      return(<><strong>{t<string>(_str)}</strong></>)
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
                <h2><strong>
                    <i>{t<string>('Seller Accounts for Search: ')}</i></strong>{hextoHuman(profileDetail.ok.search)}{' '}
                    </h2>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Cell verticalAlign='top'>
                <h2><strong><i>{withHelp('List of Seller Accounts: ', ' Search results: List of Seller Accounts. ')}</i></strong>
                <Label circular color='blue' size='large'>{profileDetail.ok.stores.length}</Label></h2>

                {profileDetail.ok.stores.length>0 && profileDetail.ok.stores.map(_store => <>
                <Message>
                <Item.Group>
                        <Item>  
                            <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_store.owner.bannerUrl)} 
                                rounded 
                                href={isHex(_store.owner.bannerUrl) ? withHttp(hexToString(_store.owner.bannerUrl).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            />                           
                            <Item.Content>
                                <Item.Header as='a'>{hextoHuman(_store.owner.sellerName)}<br /><br />
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_store.owner.sellerAccount)}
                                               {setUsername(_store.owner.sellerName)}
                                               {setCount(count + 1)}
                                               {_makeBookmarkUpdate()}</>}}
                                >{t('Bookmark Store')}</Label>
                                {photoLink(_store.owner.externalLink, 'More Info')}
                                </Item.Header>
                                <Item.Meta><h3>
                                    {t_strong('Quantity Ordered: ')}{numBadge(_store.owner.totalOrders)}<br />
                                    {t_strong('Quantity Delivered: ')}{numBadge(_store.owner.totalDelivered)}<br />
                                </h3></Item.Meta>
                                <Item.Description>
                                    {t_strong('Seller Name: ')}{hextoHuman(_store.owner.sellerName)}<br />
                                    {t_strong('Seller Account: ')}{accountInfo(_store.owner.sellerAccount)}<br />
                                    {t_strong('Location: ')}{hextoHuman(_store.owner.sellerLocation)}<br />
                                    {t_strong('Member Since: ')}{_store.owner.memberSince>0? timeStampToDate(_store.owner.memberSince): t(' New Member')}<br />
                                    {t_strong('Seller Rating: ')}{rating[rateCheck(_store.owner.reviewAverage)]}<br />
                                    {t_strong('Number of Reviews: ')}{numBadge(_store.owner.reviewCount)}<br />

                                    {_store.owner.reviews.length>0 && <>
                                      <Expander 
                                        className='Reviews-expander'
                                        isOpen={false}
                                        summary={<Label size={'small'} color='orange' circular> {t<string>('View Reviews')}</Label>}>
                                        <strong>{t<string>('Seller Reviews: ')}</strong><br />
                                        {_store.owner.reviews.length>0 && 
                                            _store.owner.reviews.map((_review, index: number) => <>
                                            {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />                            
                                        </>)}
                                    </Expander>                                    
                                    </>}
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='item-extra-stores'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('View Details')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                            {t_strong('Total Orders: ')}{_store.owner.totalOrders}<br />
                                            {t_strong('Total Delivered: ')}{_store.owner.totalDelivered}<br />
                                            {t_strong('Total Damaged: ')}{_store.owner.totalDamaged}<br />
                                            {t_strong('Total Not Received: ')}{_store.owner.totalNotReceived}<br />
                                            {t_strong('Total Refused: ')}{_store.owner.totalRefused}<br />
                                            {t_strong('Total Resolved: ')}{_store.owner.totalResolved}<br />
                                            {t_strong('Total Wrong: ')}{_store.owner.totalWrong}<br />                
                                            </Grid.Column>
                                            <Grid.Column>
                                            {renderLink(_store.owner.bannerUrl)}                                    
                                            {renderLink(_store.owner.youtubeUrl)}                                    
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Expander>

                                </Item.Extra>
                                <Expander 
                                    className='item-stores-products'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('See Offerings')}</Label>}>
                                {_store.products.length>0? <>
                                  <h2><strong><i>{withHelp('List of Products: ', ' List of Products currently being offered by this Store Account. ')}</i></strong></h2>
                                  {_store.products.length>0 && _store.products.map((_product, index: number)=> <>
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
                                                            {_makeAddToCartUpdate()}</>}}
                                                >{'Add To Cart'}</Label>
                                                <Label as='a' 
                                                    color='orange' 
                                                    circular 
                                                    onClick={()=>{<>
                                                            {setMessageId(_product.productId)}
                                                            {setUsername(_product.title)}
                                                            {setCount(count + 1)}
                                                            {_makeAddToListUpdate()}</>}}
                                                >{t('Add To List')}</Label>
                                                {photoLink(_product.moreInfoLink, 'More Info')}
                                                </Item.Header>
                                                <Item.Meta>
                                                    <h3><strong>{hextoHuman(_product.title)}</strong></h3>
                                                </Item.Meta>
                                                <Item.Description>
                                                    <strong>{t<string>('Description: ')}</strong>{hextoHuman(_product.description)}<br />
                                                    <strong>{t<string>('Price: ')}</strong>{microToGeode(_product.price)}{t(' Geode')}<br />
                                                    {t<string>('Product ID: ')}{withCopy(acctToShort(_product.productId))}<br />
                                                    <strong>{t<string>('Product Rating: ')}</strong>{rating[rateCheck(_product.reviewAverage)]}<br />
                                                    <strong>{t<string>('Number of Reviews: ')}</strong>{numBadge(_product.reviewCount)}<br />
                                                    {_product.reviews.length>0 && <>
                                                      <Expander 
                                                        className='Reviews-expander'
                                                        isOpen={false}
                                                        summary={<Label size={'small'} color='orange' circular> {t<string>('View Reviews')}</Label>}>
                                                        <strong>{t<string>('Product Reviews: ')}</strong><br />
                                                        {_product.reviews.length>0 && 
                                                            _product.reviews.map((_review, index: number) => <>
                                                            {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />                             
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
                                                        <Grid.Row>
                                                            <Grid.Column>
                                                            <strong>{t<string>('Inventory: ')}</strong>{_product.inventory}<br />
                                                            <strong>{t<string>('Seller Account: ')}</strong>{accountInfo(_product.sellerAccount)}<br />
                                                            <strong>{t<string>('Seller Name: ')}</strong>{hextoHuman(_product.sellerName)}<br />
                                                            <strong>{t<string>('Location: ')}</strong>{hextoHuman(_product.productLocation)}<br />
                                                            <strong>{t<string>('Brand: ')}</strong>{hextoHuman(_product.brand)}<br />
                                                            <strong>{t<string>('Category: ')}</strong>{hextoHuman(_product.category)}<br />
                                                            <strong>{t<string>('Delivery Info: ')}</strong>{hextoHuman(_product.deliveryInfo)}<br />
                                                            <strong>{t<string>('Digital Product: ')}</strong>{boolToHuman(_product.digital)}<br />
                                                            <strong>{t<string>('Zeno Percent: ')}</strong>{numToPercent(_product.zenoPercent)}<br />
                                                            <strong>{t<string>('Number of Zeno Buyers: ')}</strong>{_product.zenoBuyers.length}<br />
                                                            </Grid.Column>
                                                            <Grid.Column>
                                                            {renderLink(_product.photoOrYoutubeLink1)}
                                                            {renderLink(_product.photoOrYoutubeLink2)}
                                                            {renderLink(_product.photoOrYoutubeLink3)}
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                    </Expander>
                                                </Item.Extra>
                                            </Item.Content>
                                    </Item>
                                    </Item.Group>
                                </Message>
                                </>)}
                                </>: 'No Products to Offer from this Seller.'}
                                <Divider />
                                {_store.services.length>0? <>
                                  <h2><strong><i>{withHelp('List of Services: ', ' List of Services currently being offered. ')}</i></strong></h2>
                                {_store.services.length>0 && 
                                    _store.services.map((_service, index: number)=> <>
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
                                                <Item.Header as='a'>{'Product: '}
                                                <Label as='a' 
                                                    color='orange' 
                                                    circular 
                                                    onClick={()=>{<>
                                                            {setMessageId(_service.serviceId)}
                                                            {setUsername(_service.title)}
                                                            {setCount(count + 1)}
                                                            {_makeAddToCartUpdate()}</>}}
                                                >{'Add To Cart'}</Label>
                                                <Label as='a' 
                                                    color='orange' 
                                                    circular 
                                                    onClick={()=>{<>
                                                            {setMessageId(_service.serviceId)}
                                                            {setUsername(_service.title)}
                                                            {setCount(count + 1)}
                                                            {_makeAddToListUpdate()}</>}}
                                                >{'Add To List'}</Label>
                                                {photoLink(_service.bookingLink, 'Booking Link')}
                                                </Item.Header>
                                                <Item.Meta>
                                                    <h3><strong>{hextoHuman(_service.title)}</strong></h3>
                                                </Item.Meta>
                                                <Item.Description>
                                                    <strong>{t<string>('Description: ')}</strong>{hextoHuman(_service.description)}<br />
                                                    <strong>{t<string>('Price: ')}</strong>{microToGeode(_service.price)}{t(' Geode')}<br />
                                                    {t<string>('Service ID: ')}{withCopy(acctToShort(_service.serviceId))}<br />
                                                    <strong>{t<string>('Service Rating: ')}</strong>{rating[rateCheck(_service.reviewAverage)]}<br />
                                                    <strong>{t<string>('Number of Reviews: ')}</strong>{numBadge(_service.reviewCount)}<br />
                                                    {_service.reviews.length>0 && <>
                                                      <Expander 
                                                        className='Reviews-expander'
                                                        isOpen={false}
                                                        summary={<Label size={'small'} color='orange' circular> {t<string>('View Reviews')}</Label>}>
                                                        <strong>{t<string>('Service Reviews: ')}</strong><br />
                                                        {_service.reviews.length>0 && 
                                                            _service.reviews.map((_review, index: number) => <>
                                                            {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />                             
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
                                                        <Grid.Row>
                                                            <Grid.Column>
                                                            <strong>{t<string>('Inventory: ')}</strong>{_service.inventory}<br />
                                                            <strong>{t<string>('Seller Account: ')}</strong>{accountInfo(_service.sellerAccount)}<br />
                                                            <strong>{t<string>('Seller Name: ')}</strong>{hextoHuman(_service.sellerName)}<br />
                                                            <strong>{t<string>('Location: ')}</strong>{hextoHuman(_service.serviceLocation)}<br />
                                                            <strong>{t<string>('Category: ')}</strong>{hextoHuman(_service.category)}<br />
                                                            <strong>{t<string>('Online Service: ')}</strong>{boolToHuman(_service.online)}<br />
                                                            <strong>{t<string>('Zeno Percent: ')}</strong>{numToPercent(_service.zenoPercent)}<br />
                                                            <strong>{t<string>('Number of Zeno Buyers: ')}</strong>{_service.zenoBuyers.length}<br />
                                                            </Grid.Column>
                                                            <Grid.Column>
                                                            {renderLink(_service.photoOrYoutubeLink1)}
                                                            {renderLink(_service.photoOrYoutubeLink2)}
                                                            {renderLink(_service.photoOrYoutubeLink3)}
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                    </Expander>
                                                </Item.Extra>
                                            </Item.Content>
                                    </Item>
                                    </Item.Group>
                                </Message>
                                
                                </>)}


                                </>: 'No Services to offer from this Seller.'}
                                <Divider />
                                </Expander>



                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Message>
                <Divider />
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
        {isBookmark && (<>
        <CallSendMessage
                callIndex={3}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddToCart && (<>
        <CallSendMessage
                callIndex={0}
                //toAcct={_toAcct}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddToList && (<>
        <CallSendMessage
                callIndex={1}
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
export default React.memo(SearchByStoreDetails);
