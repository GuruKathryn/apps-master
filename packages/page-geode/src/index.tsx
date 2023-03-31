// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
//import type { TabItem } from '@polkadot/react-components/Tabs/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
// import { useApi } from '@polkadot/react-hooks';
// import { isFunction } from '@polkadot/util';

import LifeAndWork from './LifeAndWork';
import Home from './Home/Home';
import Market from './Market';
import Social from './Social';
import Messaging from './Messaging';


//import Api from './Api';
//import BlockInfo from './BlockInfo';
//import Forks from './Forks';
//import Latency from './Latency';
//import Main from './Main';
//import NodeInfo from './NodeInfo';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

interface TabItem {
  count?: number;
  isRoot?: boolean;
  name: string;
  text: string;
}

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    lifeAndWork: `${basePath}/lifeAndWork`,
    home: `${basePath}/`,
    market: `${basePath}/market`,
    social: `${basePath}/social`,
    messaging: `${basePath}/messaging`
  };
}

function createItemsRef (t: TFunction): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'home',
      text: t<string>('Home')
    },
    {
      //isRoot: true,
      name: 'lifeAndWork',
      text: t<string>('Life and Work')
    },
    {
      name: 'market',
      text: t<string>('Market')
    },
    {
      name: 'social',
      text: t<string>('Social')
    },
    {
      // isHidden: true,
      name: 'messaging',
      text: t<string>('Messaging')
    }
  ];
}

function GeodeApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
//  const { api } = useApi();
  // const { lastHeaders } = useBlockAuthors();
  // const { eventCount, events } = useBlockEvents();
  const itemsRef = useRef(createItemsRef(t));
  const pathRef = useRef(createPathRef(basePath));
  //const currentPath = useRef('home');
  // const hidden = useMemo<string[]>(
  //   () => isFunction(api.query.babe?.authorities) ? [] : ['forks'],
  //   [api]
  // );

  return (
    
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      
      <Switch>
        <Route path={pathRef.current.lifeAndWork}><LifeAndWork /></Route>
        <Route path={pathRef.current.market}><Market /></Route>
        <Route path={pathRef.current.social}><Social /></Route>
        <Route path={pathRef.current.messaging}><Messaging /></Route>
        <Route path={pathRef.current.home}><Home /></Route>
      </Switch>
    
    </main>
      

);
}

export default React.memo(GeodeApp);