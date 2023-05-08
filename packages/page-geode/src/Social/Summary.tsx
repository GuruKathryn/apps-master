// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Badge, Card, CardSummary, SummaryBox, AccountName, LabelHelp, IdentityIcon } from '@polkadot/react-components';
import { useTranslation } from '../translate';
//import { formatNumber } from '@polkadot/util';
import JSONinfo from '../shared/geode_social_info.json';
import { useToggle } from '@polkadot/react-hooks';


// interface Props {
//   className?: string;
//   hashes?: string[];
// }

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;
  const [isShowInfo, toggleShowInfo] = useToggle(true)
  const [isShowMore, toggleShowMore] = useToggle(false)

  function showAccount(str: string): JSX.Element { 
   try{
    return(  <>
      {str.length>0 && (<>
        <IdentityIcon value={str} />
        {' ('}<AccountName value={str} withSidebar={true}/>{') '}
      </>)}
      </>
      )
   } catch(e) {
    console.log(e);
    return(<>
    {t<string>('No accounts to show')}
    </>)
   }
  }

    return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t<string>('Geode Social')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge
      icon={'info'}
           color={(isShowInfo) ? 'blue' : 'gray'}
           onClick={toggleShowInfo}/> 
      <strong> {t<string>('Info for Social')} </strong>
      {isShowInfo && (<>
        {': '}{t<string>(info[0]+info[1])}       
      </>)}      
      <br /><br />

    <Badge
      icon={(isShowMore)? 'info':'info'}
           color={(isShowMore) ? 'blue' : 'gray'}
           onClick={toggleShowMore}/> 
    <strong>{t<string>('More')}</strong>
      {isShowMore && (<>
        {':'}{t<string>(info[2])}{' '}
        {' '}{showAccount(info[3])}
        {' '}{showAccount(info[4])}
      </>)}
    </Card>
    </div>
  );
}

export default React.memo(Summary);
