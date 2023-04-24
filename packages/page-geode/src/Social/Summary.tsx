// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Badge, Card, CardSummary, SummaryBox } from '@polkadot/react-components';

import { useTranslation } from '../translate';
//import { formatNumber } from '@polkadot/util';

// import { useTranslation } from '../translate';

// interface Props {
//   className?: string;
//   hashes?: string[];
// }

function Summary (): React.ReactElement {
  const { t } = useTranslation();

  // const { t } = useTranslation();
  // const linkCount = 5;
  // const itemCount = 0;
  return (
    <div>
    <SummaryBox>
      <CardSummary label={''}>
      {t<string>('Geode Social')}
      </CardSummary>
    </SummaryBox>
    <Card>
        <strong>{t<string>('Follow your favorite accounts and post your own public broadcast messages that cannot be deleted, altered or censored! While you are at it, isnt it time you got paid directly for your time and attention? Let people know what you are interested in seeing and let advertisers pay YOU directly to include their posts in your feed.')}</strong>
        {' '}
        <Badge icon='info' color={'blue'} /> 
        <strong>{t<string>('- Use the info Icon Button to get more information for each Menu Selection. ')}{' '}</strong>
    </Card>
    </div>
  );
}

export default React.memo(Summary);
