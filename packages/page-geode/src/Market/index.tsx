// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Table } from '@polkadot/react-components';

import Summary from './Summary';
import Details from './Details';
//import NewsFeed from './NewsFeed';
//import NewsArticles from './NewsArticles';

//import { useApi } from '@polkadot/react-hooks';

//import useChainInfo from '../useChainInfo';
//import Extensions from './Extensions';
//import NetworkSpecs from './NetworkSpecs';

export default function Market (): React.ReactElement {
//  const { isDevelopment } = useApi();
//  const chainInfo = useChainInfo();

  return (
    <div>
        <Table >
            <Summary />
            <Details />           
        </Table>
    </div>
  );
}
