// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '../translate';


function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const summaryOne: string = ' Register your claims of expertise, work history, education/training, good deeds and original intellectual property to the Geode Blockchain. Endorse the authenticity of other users’ claims. Look up resumes by account. Search claims by keyword to discover people and their contributions to the world. ';

  return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t<string>('Geode Life and Work')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
      <strong>  {t<string>(summaryOne)}  </strong> <br />
    </Card>
    </div>
  );
}

export default React.memo(Summary);
