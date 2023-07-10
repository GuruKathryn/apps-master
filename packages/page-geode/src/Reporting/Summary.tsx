// Copyright 2017-2023 @polkadot/app-referral authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Badge, Card, CardSummary, SummaryBox, LabelHelp } from '@polkadot/react-components';
import { useTranslation } from '../translate';
//import { formatNumber } from '@polkadot/util';
import JSONinfo from '../shared/geode_reporting_info.json';
import { useToggle } from '@polkadot/react-hooks';


// interface Props {
//   className?: string;
//   hashes?: string[];
// }

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;
  const [isShowInfo, toggleShowInfo] = useToggle(true)
  
    return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t<string>('Geode Reporting')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge
      icon={'info'}
           color={(isShowInfo) ? 'blue' : 'gray'}
           onClick={toggleShowInfo}/> 
      <strong> {t<string>('Report Illegal and/or Suspicious Activity in the Ecosystem.')} </strong>
      {isShowInfo && (<>
        {': '}{t<string>(info[0])}       
      </>)}      
    </Card>
    </div>
  );
}

export default React.memo(Summary);
