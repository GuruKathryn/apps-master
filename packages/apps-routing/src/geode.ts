// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-geode'; //< --- check this
//import Component from 'packages/app-geode/src/index'; //< --- check this


export default function create (t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'geode',
    icon: 'cogs',
    name: 'geode',
    text: t('nav.geode', 'Geode', { ns: 'apps-routing' }),
  };
}
