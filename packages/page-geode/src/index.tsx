// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
//import type { TabItem } from '@polkadot/react-components/Tabs/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
//import { useAccounts, useIpfs } from '@polkadot/react-hooks';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import LifeAndWork from './LifeAndWork';
import Profile from './Profile';
import Home from './Home/Home';
import Market from './Market';
import Social from './Social';
import Messaging from './Messaging';
import Reporting from './Reporting';

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

//const HIDDEN_ACC = ['lifeAndWork'];

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    lifeAndWork: `${basePath}/lifeAndWork`,
    profile: `${basePath}/profile`,
    home: `${basePath}/`,
    market: `${basePath}/market`,
    social: `${basePath}/social`,
    messaging: `${basePath}/messaging`,
    reporting: `${basePath}/reporting`
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
      name: 'lifeAndWork',
      text: t<string>('Life and Work')
    },
    {
      name: 'profile',
      text: t<string>('Profile')
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
    },
    {
      // isHidden: true,
      name: 'reporting',
      text: t<string>('Reporting')
    }

  ];
}

function GeodeApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // to hide for non-account access
  //const { hasAccounts } = useAccounts();
  //const { isIpfs } = useIpfs();

  const itemsRef = useRef(createItemsRef(t));
  const pathRef = useRef(createPathRef(basePath));

  return (
    
    <main className={className}>
      <Tabs
        basePath={basePath}
        //hidden={(hasAccounts && !isIpfs) ? undefined : HIDDEN_ACC}
        items={itemsRef.current}
      />
      
      <Switch>
        <Route path={pathRef.current.reporting}><Reporting /></Route>
        <Route path={pathRef.current.lifeAndWork}><LifeAndWork /></Route>
        <Route path={pathRef.current.profile}><Profile /></Route>
        <Route path={pathRef.current.market}><Market /></Route>
        <Route path={pathRef.current.social}><Social /></Route>
        <Route path={pathRef.current.messaging}><Messaging /></Route>
        <Route path={pathRef.current.home}><Home /></Route>
        
      </Switch>
    
    </main>
      

);
}

export default React.memo(GeodeApp);