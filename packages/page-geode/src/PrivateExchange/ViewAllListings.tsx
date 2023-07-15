// Copyright 2017-2023 @polkadot/app-reporting authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from './types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, AccountName, Card, Icon, Badge, Label, Button } from '@polkadot/react-components';
import { Input, Table } from 'semantic-ui-react'

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

type ListingObj = {
  listingId: string,
  seller: string,
  offerCoin: string,
  askingCoin: string,
  pair: string[],
  price: number,
  method: string,
  inventory: number,
  country: string,
  city: string,
  notes: string,
  hide: boolean,
}

type PairListings = {
  pair: string[],
  averagePrice: number,
  listingCount: number,
  totalInventory: number,
  listings: ListingObj[],
}

type PairListingsVec ={
  pairListings: PairListings[]
}

type AllListingsDetail = {
ok: PairListingsVec
}

function ViewAllListings ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const objOutput: string = stringify(output);
  const _Obj = JSON.parse(objOutput);
  const allListingsDetail: AllListingsDetail = Object.create(_Obj);
  const [searchString, setSearchString] = useState('');
    
 function BNtoGeode(_num: number): JSX.Element {
    return(<>
        {_num>0? <>{(_num/1000000000000).toString()}</>: <>{'0'}</>}
    </>)
  }

  function ShowAllListings(): JSX.Element {
    try {
      return(
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              {allListingsDetail.ok.pairListings.length > 0 && allListingsDetail.ok.pairListings
              // sort into descending order based on total inventory
              .sort((a, b) => b.totalInventory - a.totalInventory)                          
              // map to output
              .map((_out, index: number) =>  
              <div>
              {/* Expander showing all listings for each pair */}
              <Expander
                  className='showPairs'
                  isOpen={true}
                  summary={<h2>
                    <strong>{isHex(_out.pair[0]) ? hexToString(_out.pair[0]) : ' '}{t<string>(' / ')}{isHex(_out.pair[1]) ? hexToString(_out.pair[1]) : ' '}</strong>
                    <br />{t<string>(' Average Price: ')}{BNtoGeode(_out.averagePrice)}
                    {t<string>(' | ')}{t<string>(' Listing Count: ')}{_out.listingCount}
                    {t<string>(' | ')}{t<string>(' Total Available: ')}{BNtoGeode(_out.totalInventory)}
                    </h2>
                  }>
                  {/* individual listings map */}
                    {_out.listings.length > 0 && _out.listings
                      // keyword filter
                      .filter(obj => (
                        hexToString(obj.city).toLowerCase().includes(searchString.toLowerCase())
                        || hexToString(obj.country).toLowerCase().includes(searchString.toLowerCase())
                        || hexToString(obj.method).toLowerCase().includes(searchString.toLowerCase())
                        || hexToString(obj.notes).toLowerCase().includes(searchString.toLowerCase())
                        || obj.seller.includes(searchString)
                        || hexToString(obj.offerCoin).toLowerCase().includes(searchString.toLowerCase())
                        || hexToString(obj.askingCoin).toLowerCase().includes(searchString.toLowerCase())
                        )
                      )
                      // sort into descending order based on price
                      .sort((a, b) => b.price - a.price)                          
                      // map to output
                      .map((_list, index: number) =>  
                      <div>
                      <Expander
                        className='showThisListing'
                        isOpen={false}
                        summary={<h3>
                          <Button isCircular icon='gem'/>
                          <strong>{t<string>(' Location: ')}</strong>{isHex(_list.city) ? hexToString(_list.city) : ' '}{t<string>(', ')}{isHex(_list.country) ? hexToString(_list.country) : ' '}
                          {t<string>(' | ')}<strong>{t<string>(' Price: ')}</strong>{BNtoGeode(_list.price)}
                          {t<string>(' | ')}<strong>{t<string>(' Available: ')}</strong>{BNtoGeode(_list.inventory)}
                          {t<string>(' | ')}<strong>{t<string>(' Seller: ')}</strong><AccountName value={_list.seller} withSidebar={true}/>
                          </h3>
                        }>
                        {/* Listing details  */}
                        <><strong>{t<string>(' Method: ')}</strong>{isHex(_list.method) ? hexToString(_list.method) : ' '}</>
                        <br /><><strong>{t<string>(' Notes: ')}</strong>{isHex(_list.notes) ? hexToString(_list.notes) : ' '}</>
                        <br /><><strong>{t<string>(' Listing ID: ')}</strong>{_list.listingId}</>
                      </Expander>
                      </div>
                    )} 
                    
                  <br /><br />
              </Expander>
              <br /><br />
              </div>
              )}     
            </Table.Cell>
          </Table.Row>
        </Table>
        </div> 
      )

    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t<string>('No Reports To Show')}</Card>
        </div>
      )
    }
  }

  return (
    <StyledDiv className={className}>
    <Card>
      <Input  id="inputSearchString"
              name="inputSearchString"
              type="text"
              placeholder='Search...'
              value={searchString}
              onChange={(e) => {setSearchString(e.target.value)}}
      />
      <ShowAllListings />
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

export default React.memo(ViewAllListings);
