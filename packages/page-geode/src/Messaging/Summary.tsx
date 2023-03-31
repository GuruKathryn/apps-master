// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
//import { formatNumber } from '@polkadot/util';

// import { useTranslation } from '../translate';

// interface Props {
//   className?: string;
//   hashes?: string[];
// }

function Summary (): React.ReactElement {
  // const { t } = useTranslation();
  // const linkCount = 5;
  // const itemCount = 0;
  return (
    <div>
    <SummaryBox>
      <CardSummary label={''}>
      Geode Messaging
      </CardSummary>
    </SummaryBox>
    </div>
  );
}

export default React.memo(Summary);
