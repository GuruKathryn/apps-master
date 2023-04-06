// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';

import { useTranslation } from '../translate';

// interface Props {
//   className?: string;
//   hashes?: string[];
// }

function Summary (): React.ReactElement {
    const { t } = useTranslation();
  return (
    <div>
    <SummaryBox>
      <CardSummary label={''}>
      {t<string>('Geode Profile')}
      </CardSummary>
    </SummaryBox>
    <Card>
        <strong>{t<string>('Set or update your Geode Profile, look up the profile for a specific account, and search profiles by keyword.')}</strong>
    </Card>
    </div>
  );
}

export default React.memo(Summary);
