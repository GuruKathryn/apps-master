// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import { Feed, Icon } from 'semantic-ui-react'

import { Card } from '@polkadot/react-components';

//import { formatNumber } from '@polkadot/util';

//import { useTranslation } from '../translate';

// interface Props {
//   className?: string;
//   hashes?: string[];
// }

function Details (): React.ReactElement {
//  const { t } = useTranslation();

  return (
    <div>
    <Card>
        <strong>Geode Market</strong>
    </Card>
    <Card>
    <strong>Coming Soon! </strong> Buy and sell products and services on the 
    Geode Market where there is no middleman taking a cut of your profits! 
    Books, Music, NFTs, Clothing, Food, Services of all kinds, even Housing! 
    Buy and sell all the things you need to live your best life right here on Geode. 
    </Card>
    </div>
  );
}

export default React.memo(Details);
