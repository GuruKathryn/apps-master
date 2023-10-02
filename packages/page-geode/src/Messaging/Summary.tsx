// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Toggle, Badge, Card, CardSummary, SummaryBox, AccountName, LabelHelp, IdentityIcon } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { useToggle } from '@polkadot/react-hooks';


function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = [
    " Private short form messaging between Geode accounts! While you are at it, isn't it time you got paid for your time and attention? Let people know what you are interested in seeing and let advertisers, recruiters, and others pay YOU directly to send DMs to your inbox. ",
    " ",
    " Example Geode Messaging accounts you can look up: ",
    "5DaQjx5i9gcVLrGTAZ5s9KvZtfgBhU6gwtKqmXffot2dDhZm",
    "5DnfaNLDTkQwRBCRV95cfkRf3Hymaqbd13Bh9ZwMkkFkCptc"];
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
        {t<string>('Geode Private Messaging')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge icon={'info'} color={'blue'}/> 
      <strong> {t<string>('Info for Private Messaging')} </strong>
        {': '}{t<string>(info[0]+info[1])}       
      <br /><br />

    <Toggle
            className=''
            label={t<string>('Recommended Accounts ')}
            onChange={toggleShowMore}
            value={isShowMore}
          />
      {isShowMore && (<>
        <LabelHelp help={t<string>('Click on the Icon or Open the Side Car for Copying the Account Address.')} />
        {' '}{t<string>(info[2])}{' '}
        {' '}{showAccount(info[3])}
        {' '}{showAccount(info[4])}
      </>)}    
    </Card>
    </div>
  );
}

export default React.memo(Summary);
