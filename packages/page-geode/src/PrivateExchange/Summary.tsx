// Copyright 2017-2023 @polkadot/app-referral authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Badge, Card, CardSummary, SummaryBox, LabelHelp } from '@polkadot/react-components';
import { useTranslation } from '../translate';
//import { formatNumber } from '@polkadot/util';
import JSONinfo from '../shared/geode_private_exchange_info.json';
import { useToggle } from '@polkadot/react-hooks';


function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;
  const [isShowInfo, toggleShowInfo] = useToggle(true)
  
    return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t<string>('Geode Private Exchange')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge
      icon={'info'}
           color={(isShowInfo) ? 'blue' : 'gray'}
           onClick={toggleShowInfo}/> 
      <strong> {t<string>('Sell commodity coins of any kind. List your coin for sale, and let the community know how they can buy it. ')} </strong>
      {isShowInfo && (<>
        {': '}{t<string>(info[0])}       
      </>)}      
    </Card>
    </div>
  );
}

export default React.memo(Summary);
