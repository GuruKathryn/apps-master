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
import { Divider, Item, Message, Table, Label, Image } from 'semantic-ui-react'
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

  type ProductObj = {
    search: string,
    products: Products[],
  }

  type ProfileDetail = {
  ok: ProductObj
  }
  
function SearchByProductDetails ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
//    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const [count, setCount] = useState(0);
    const [isAddToCart, setAddToCart] = useState(false);
    const [isAddToList, setAddToList] = useState(false);
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');


    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
    const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');

    const _reset = useCallback(
      () => {setAddToCart(false);
             setAddToList(false);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
      () => {setAddToCart(true);
             setAddToList(false);
            },
      []
    )

    const _makeAddToListUpdate = useCallback(
      () => {setAddToCart(false);
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

    function hextoHuman(_hexIn: string): string {
        return((isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '')
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
    

    function accountInfo(_acct: string): JSX.Element {
      return(<>
          <IdentityIcon value={_acct}/>
          <AccountName value={_acct}/>
          {acctToShort(_acct)}{' '}
          <CopyInline value={_acct} label={''}/>
      </>)
  }

    //   function timeStampToDate(tstamp: number): JSX.Element {
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
              </Table.Row>
            </Table.Header>
              <Table.Cell verticalAlign='top'>
                  <h2><LabelHelp help={t<string>(' List of Products currently being offered. ')} />
                  {' '}<strong><i>{t<string>('List of Products: ')}</i></strong></h2>
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
                                >{'Add To List'}</Label>
                                  {photoLink(_product.moreInfoLink, 'More Info')}
                                  </Item.Header>
                                  <Item.Meta>
                                      <h3><strong>{hextoHuman(_product.title)}</strong></h3>
                                  </Item.Meta>
                                  <Item.Description>
                                      <strong>{t<string>('Description: ')}</strong>{hextoHuman(_product.description)}<br />
                                      <strong>{t<string>('Price: ')}</strong>{microToGeode(_product.price)}{t(' Geode')}<br />
                                      <strong>{t<string>('Reviews: ')}</strong>{'4.5 ⭐️'}<br />
                                      {t<string>('Product ID: ')}{acctToShort(_product.productId)}
                                      {' '}<CopyInline value={_product.productId} label={''}/><br />
                                      
                                  </Item.Description>
                                  <Item.Extra>
                                  <Expander 
                                    className='message'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t<string>('Details')}</Label>}>
                                      <strong>{t<string>('Inventory: ')}</strong>{_product.inventory}<br />
                                      <strong>{t<string>('Seller Account: ')}</strong>{accountInfo(_product.sellerAccount)}<br />
                                      <strong>{t<string>('Seller Name: ')}</strong>{hextoHuman(_product.sellerName)}<br />
                                      <strong>{t<string>('Location: ')}</strong>{hextoHuman(_product.productLocation)}<br />
                                      <strong>{t<string>('Brand: ')}</strong>{hextoHuman(_product.brand)}<br />
                                      <strong>{t<string>('Category: ')}</strong>{hextoHuman(_product.category)}<br />
                                      <strong>{t<string>('Delivery Info: ')}</strong>{hextoHuman(_product.deliveryInfo)}<br />
                                      <strong>{t<string>('Zeno Percent: ')}</strong>{_product.zenoPercent}<br />
                                      <strong>{t<string>('Digital Product: ')}</strong>{boolToHuman(_product.digital)}<br />
                                      {_product.digital && <>
                                      {t<string>('File Url: ')}{' '}{ photoLink(_product.digitalFileUrl, 'Link')}<br />
                                      </>}
                                      {renderLink(_product.photoOrYoutubeLink1)}
                                      {renderLink(_product.photoOrYoutubeLink2)}
                                      {renderLink(_product.photoOrYoutubeLink3)}
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
export default React.memo(SearchByProductDetails);
