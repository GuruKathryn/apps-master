// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';
//import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';


function Summary (): React.ReactElement {
  const { t } = useTranslation();
  //const linkCount = 5;
  //const itemCount = 0;
  const summaryOne: string = ' Life and Work ';
  const summaryTwo: string = ' - In this app you can make claims for your educational, professional and personal history. ';
  const summaryThree: string = 'Additionally, you can submit endorsements for other users educational, professional and personal history. ';
  

  return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t<string>('Geode Life and Work')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
      <strong>  {t<string>(summaryOne)}  </strong> <br /><br />
                {t<string>(summaryTwo)}  
                {t<string>(summaryThree)} <br />
    </Card>
    </div>
  );
}

export default React.memo(Summary);
