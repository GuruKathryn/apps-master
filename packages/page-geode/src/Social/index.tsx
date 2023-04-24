// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Card, Button,Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../translate';
import { useCodes } from '../useCodes';
import { useContracts } from '../useContracts';

import ContractsTable from './ContractsTable';

import Summary from './Summary';
//import Details from './Details';
//import NewsFeed from './NewsFeed';
//import NewsArticles from './NewsArticles';

//import { useApi } from '@polkadot/react-hooks';

//import useChainInfo from '../useChainInfo';
//import Extensions from './Extensions';
//import NetworkSpecs from './NetworkSpecs';

interface Props {
  className?: string;
}

export default function Social ({ className = '' }: Props): React.ReactElement {
//  const { isDevelopment } = useApi();
//  const chainInfo = useChainInfo();
const { t } = useTranslation();
const { allCodes, codeTrigger } = useCodes();
const { allContracts } = useContracts();

const [isFeed, toggleFeed] = useToggle();
const [isPost, togglePost] = useToggle();
const [isSearch, toggleSearch] = useToggle();
const [isSettings, toggleSettings] = useToggle();
const [isYourFeed, toggleYourFeed] = useToggle();
const [isPaidFeed, togglePaidFeed] = useToggle();
const [isYourPost, toggleYourPost] = useToggle();
const [isPaidPost, togglePaidPost] = useToggle();
const [isAccountSearch, toggleAccountSearch] = useToggle();
const [isKeywordSearch, toggleKeywordSearch] = useToggle();
const [isUpdate, toggleUpdate] = useToggle();
const [isFollow, toggleFollow] = useToggle();
const [isUnFollow, toggleUnFollow] = useToggle();
const [isBlock, toggleBlock] = useToggle();
const [isUnBlock, toggleUnBlock] = useToggle();

const isNoPost: boolean = false;

const refTitle: string[] = 
[' Display a feed of all public messages and endorsed public messages from all accounts that you follow, sorted by most recent. (Click again to close) ', 
 ' Make a Post or a paid Post. (Click again to close) ', 
 ' Look up individual accounts or Search by keyword. ',
 ' Update your settings, follow, unfollow, block and unblock other accounts',
 ' Get your Feed. (Click again to close) ',
 ' Get your Paid Feed. (Click again to close)',
 ' Make a Post (Click again to close)',
 ' Make a Paid Post (Click again to close)',
 ' Search by Account (Click again to close) ',
 ' Search by Keyword (Click again to close)',
 ' Update Settings including Username, Interests and other settings.',
 ' Include Accounts in your feed to follow.',
 ' Unfollow selected Accounts.',
 ' Block an Account from showing in your feed',
 ' Unblock an Account'];

// todo
console.log(allCodes);

  return (
    <StyledDiv className={className}>
    <div>
        <Table >
          <Summary />
            <Card>
            {!isYourFeed && !isPaidFeed && !isPost && !isSettings && !isSearch && (
            <><Button
                icon={(isFeed) ? 'minus' : 'plus'}
                label={t<string>('Feeds')}
                onClick={toggleFeed}>
            </Button></>
            )}
            {isNoPost && !isYourPost && !isPaidPost && !isFeed && !isSettings && !isSearch && (
            <><Button
                icon={(isPost) ? 'minus' : 'plus'}
                label={t<string>('Post')}
                onClick={togglePost}>
            </Button></>
            )}
            {!isAccountSearch && !isKeywordSearch && !isFeed && !isPost && !isSettings && (
            <><Button
                icon={(isSearch) ? 'minus' : 'plus'}
                label={t<string>('Search')}
                onClick={toggleSearch}>
            </Button></>
            )}
            {!isUpdate && !isFollow && !isUnFollow && !isBlock && !isUnBlock && !isFeed && !isPost && !isSearch && (
            <><Button
                icon={(isSettings) ? 'minus' : 'plus'}
                label={t<string>('Settings')}
                onClick={toggleSettings}>
            </Button></>
            )}
            {isFeed && (<>{refTitle[0]}</>)}
            {isPost && (<>{refTitle[1]}</>)}
            {isSearch && (<>{refTitle[2]}</>)}
            {isSettings && (<>{refTitle[3]}</>)}
            </Card>  
        {isFeed && (
        <><Card>
          {!isPaidFeed && (
            <><Button
                icon={(isYourFeed) ? 'minus' : 'plus'}
                label={t('Your Feed')}
                onClick={toggleYourFeed}>
              </Button></>
          )}
          {!isYourFeed && (
            <><Button
              icon={(isPaidFeed) ? 'minus' : 'plus'}
              label={t('Paid Feed')}
              onClick={togglePaidFeed}>
            </Button></>
          )}
          {isYourFeed && (<>{refTitle[4]}</>)}
          {isPaidFeed && (<>{refTitle[5]}</>)}
          </Card></>
        )}
        {isPost && (
        <><Card>
          {!isPaidPost && (
            <><Button
                icon={(isYourPost) ? 'minus' : 'plus'}
                label={t('Post')}
                onClick={toggleYourPost}>
              </Button></>
          )}
          {!isYourPost && (
            <><Button
              icon={(isPaidPost) ? 'minus' : 'plus'}
              label={t('Paid Post')}
              onClick={togglePaidPost}>
            </Button></>
          )}
          {isYourPost && (<>{refTitle[6]}</>)}
          {isPaidPost && (<>{refTitle[7]}</>)}
          </Card></>
        )}
        {isSearch && (
        <><Card>
          {!isKeywordSearch && (
            <><Button
                icon={(isAccountSearch) ? 'minus' : 'plus'}
                label={t('Account Lookup')}
                onClick={toggleAccountSearch}>
              </Button></>
          )}
          {!isAccountSearch && (
            <><Button
              icon={(isKeywordSearch) ? 'minus' : 'plus'}
              label={t('By Keyword')}
              onClick={toggleKeywordSearch}>
            </Button></>
          )}
          {isAccountSearch && (<>{refTitle[8]}</>)}
          {isKeywordSearch && (<>{refTitle[9]}</>)}
          </Card></>
        )}
        {isSettings && (
        <><Card>
          {!isFollow && !isUnFollow && !isBlock && !isUnBlock && (
            <><Button
                icon={(isUpdate) ? 'minus' : 'plus'}
                label={t('Update Settings')}
                onClick={toggleUpdate}>
              </Button></>
          )}
          {!isUpdate && !isUnFollow && !isBlock && !isUnBlock && (
            <><Button
              icon={(isFollow) ? 'minus' : 'plus'}
              label={t('Follow')}
              onClick={toggleFollow}>
            </Button></>
          )}
          {!isFollow && !isUpdate && !isBlock && !isUnBlock && (
            <><Button
                icon={(isUnFollow) ? 'minus' : 'plus'}
                label={t('Unfollow')}
                onClick={toggleUnFollow}>
              </Button></>
          )}
          {!isFollow && !isUnFollow && !isUpdate && !isUnBlock && (
            <><Button
                icon={(isBlock) ? 'minus' : 'plus'}
                label={t('Block')}
                onClick={toggleBlock}>
              </Button></>
          )}
          {!isFollow && !isUnFollow && !isBlock && !isUpdate && (
            <><Button
                icon={(isUnBlock) ? 'minus' : 'plus'}
                label={t('Unblock')}
                onClick={toggleUnBlock}>
              </Button></>
          )}
          {isUpdate && (<>{refTitle[10]}</>)}
          {isFollow && (<>{refTitle[11]}</>)}
          {isUnFollow && (<>{refTitle[12]}</>)}
          {isBlock && (<>{refTitle[13]}</>)}
          {isUnBlock && (<>{refTitle[14]}</>)}
          </Card></>
        )}
        </Table>
        {isYourPost && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={0}
        />)}
        {isPaidPost && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={1}
        />)}

        {isFollow && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={4}
        />)}
        {isUnFollow && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={5}
        />)}
        {isBlock && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={6}
        />)}
        {isUnBlock && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={7}
        />)}
        {isUpdate && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={8}
        />)}
        {isYourFeed && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={9}
        />)}
        {isPaidFeed && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={10}
        />)}
        {isAccountSearch && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={11}
        />)}


        {isKeywordSearch && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={13}
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
