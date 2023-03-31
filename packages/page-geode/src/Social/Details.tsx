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
        <strong>Geode Social Media</strong>
    </Card>
    <Card>
    <strong> Coming Soon! </strong> Follow your favorite accounts and post your own 140 
    character public broadcast messages that cannot be deleted, altered 
    or censored! While you are at it, isn't it time you got paid directly 
    for your time and attention? Let people know what you are interested in 
    seeing and let advertisers pay YOU directly to include their posts in your feed.  
    </Card>
    </div>
  );
}

export default React.memo(Details);
