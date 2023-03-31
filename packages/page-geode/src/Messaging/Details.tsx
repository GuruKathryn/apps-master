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
        <strong>Geode Private Messaging</strong>
    </Card>
    <Card>
    <strong>Coming Soon!</strong> Private short form messaging between Geode 
    accounts! While you are at it, isn't it time you got paid for your time 
    and attention? Let people know what you are interested in seeing and let 
    advertisers, recruiters, and others pay YOU directly to send DMs to your inbox. 
    </Card>
    </div>
  );
}

export default React.memo(Details);
