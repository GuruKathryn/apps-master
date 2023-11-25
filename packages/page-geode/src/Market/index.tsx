// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import React, { useCallback, useState } from 'react';

import styled from 'styled-components';

import { Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../translate';
import { useCodes } from '../useCodes';
import { useContracts } from '../useContracts';

import ContractsTable from './ContractsTable';

import Summary from './Summary';
//import Details from './Details';

interface Props {
    className?: string;
  }
  
export default function Market ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    const [isFindProducts, toggleFindProducts] = useToggle();
    const [isFindServices, toggleFindServices] = useToggle();
    const [isMyOrders, toggleMyOrders] = useToggle();
    const [isMyAccount, toggleMyAccount]=useToggle();
    const [isMyCart, toggleMyCart] = useToggle();
    const [isSellerAcct, toggleSellerAcct] = useToggle();

    const [isUpdateSet, toggleUpdateSet] = useToggle();
    const [isAddProduct, toggleAddProduct] = useToggle();
    const [isAddService, toggleAddService] = useToggle();

    const refTitle: string[] = 
    [' Find Geode Market Products (Click again to close) ', 
     ' Find Geode Market Services. (Click again to close) ', 
     ' List of My Orders (Click again to close). ',
     ' List My Account. (Click again to close) ',
     ' View My Cart (Click again to close). ',
     ' Manage Your Seller Account (Click again to close).'];
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);
    //todo
    const deployApp: boolean = true;
        
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
            {!deployApp && (<><strong>{'Coming Soon!'}</strong></>)}

        {deployApp && !isFindServices 
                   && !isMyOrders  && !isMyAccount && !isMyCart 
                   && !isSellerAcct && (
        <><Button
                icon={(isFindProducts) ? 'minus' : 'plus'}
                label={t<string>('Find Products')}
                onClick={toggleFindProducts}>
          </Button>
          </>
        )}
        {deployApp && !isFindProducts 
                   && !isMyOrders  && !isMyAccount && !isMyCart 
                   && !isSellerAcct && (
          <>
              <Button
                icon={(isFindServices) ? 'minus' : 'plus'}
                label={t('Find Services')}
                onClick={toggleFindServices}>
              </Button>    
          </>
        )}
        {deployApp && !isFindProducts 
                   && !isFindServices && !isMyAccount && !isMyCart 
                   && !isSellerAcct && (
          <>
          <Button
            icon={(isMyOrders) ? 'minus' : 'plus'}
            label={t('My Orders')}
            onClick={toggleMyOrders}>
          </Button>    
          </>
        )}
        {deployApp && !isMyOrders && !isFindProducts 
                   && !isFindServices && !isMyCart 
                   && !isSellerAcct && (
          <>
          <Button
            icon={(isMyAccount) ? 'minus' : 'plus'}
            label={t('My Account')}
            onClick={toggleMyAccount}>
          </Button>    
          </>
        )}
        {deployApp && !isMyOrders && !isFindProducts 
                   && !isFindServices && !isMyAccount 
                   && !isSellerAcct && (
          <>
          <Button
            icon={(isMyCart) ? 'minus' : 'plus'}
            label={t('My Cart')}
            onClick={toggleMyCart}>
          </Button>    
          </>
        )}
        {deployApp && !isMyOrders && !isFindProducts 
                   && !isFindServices && !isMyAccount 
                   && !isMyCart && (
          <>
          <Button
            icon={(isSellerAcct) ? 'minus' : 'plus'}
            label={t('Seller Account')}
            isDisabled={isUpdateSet || isAddProduct || isAddService}
            onClick={toggleSellerAcct}>
          </Button>    
          </>
        )}

        {isFindProducts && (<>{refTitle[0]}</>)}
        {isFindServices && (<>{refTitle[1]}</>)}
        {isMyOrders && (<>{refTitle[2]}</>)}
        {isMyAccount && (<>{refTitle[3]}</>)}
        {isMyCart && (<>{refTitle[4]}</>)}
        {isSellerAcct && (<>{refTitle[5]}</>)}
        </Card> 

        {isSellerAcct && (
        <>
          <Card>
            <>
              <Button
                icon={(isUpdateSet) ? 'minus' : 'plus'}
                label={t('Update Settings')}
                isDisabled={isAddProduct || isAddService}
                onClick={toggleUpdateSet}>
              </Button>    
            </>
            <>
              <Button
                icon={(isAddProduct) ? 'minus' : 'plus'}
                label={t('Add Product')}
                isDisabled={isUpdateSet || isAddService}
                onClick={toggleAddProduct}>
              </Button>    
            </>
            <>
              <Button
                icon={(isAddService) ? 'minus' : 'plus'}
                label={t('Add Service')}
                isDisabled={isUpdateSet || isAddProduct}
                onClick={toggleAddService}>
              </Button>    
            </>
          </Card>
        </>
        )}
        </Table>
        {isFindProducts && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={30}
        />)}
        {isFindServices && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={31}
        />)}

        {isUpdateSet && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={18}
        />)}
        {isAddProduct && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={26}
        />)}
        {isAddService && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={28}
        />)}
        {isMyCart && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={35}
        />)}
        {isSellerAcct && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={37}
        />)}

    </div>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;
