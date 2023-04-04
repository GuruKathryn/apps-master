// Copyright 2017-2023 @blockandpurpose Home.tsx authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Label } from 'semantic-ui-react';
//import { useApi } from '@polkadot/react-hooks';
import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';

//import useChainInfo from '../useChainInfo';
//import Extensions from './Extensions';
//import NetworkSpecs from './NetworkSpecs';

export default function Home (): React.ReactElement {
//  const { isDevelopment } = useApi();
//  const chainInfo = useChainInfo();
//const currentCoinPrice = '';
//const lowTrend = '$0.99';
//const highTrend = '$1.01';
//const weeklyChange = '0.00 %';
//const weeklyTrend = ' ▲ ';
//const coinName = "GROPO";
//const infoIcon ='Current Coin market value in USD.\n '
//const buyGeode = ' Buy Geode! '
//const infoBuyGeode = ' Coming Soon! '
const BlockandPurpose = () => {
  return (
      <div>				
        <a href={"https://blockandpurpose.com"}
                  target="_blank" 
                  rel="noopener noreferrer"
        > 
        Block and Purpose Home Page </a>
      </div> 
  )
};

const GeodeWhitePaper = () => {
  return(
  <div>
    <a href={"https://blockandpurpose.com/wp-content/uploads/2022/10/Geode-Blockchain-Whitepaper-V2022_10_03.pdf"}
              target="_blank" 
              rel="noopener noreferrer"
    >
    Geode White Paper
    </a></div>
  )
}

const DiscordConnection = () => {
  return(
    <div>
    <a href={"https://discord.com/invite/2v4DPxDQXt"}
              target="_blank" 
              rel="noopener noreferrer"
    >
    Join Us on Discord
    </a></div>
  )
}

const SignUpForAnnouncements = () => {
  return(
    <div>
    <a href={"https://blockandpurpose.com/announcements/"}
              target="_blank" 
              rel="noopener noreferrer"
    >
    Sign up for Announcements
    </a></div>
  )
}

const GoToGitHub = () => {
  return(
    <div>
    <a href={"https://github.com/SparticleConcepts"}
              target="_blank" 
              rel="noopener noreferrer"    
    >
    Go to Geode on GitHub
    </a></div>
  )
}

// const BuyGeode = () => {
//   return(
//     <div>
//     <a href={"https://kathryncolleen.com/studio/geode-blockchain/"}>
//     </a></div>
//   )
// }

  return (
    <div>
      <SummaryBox>        
      <CardSummary label={''}>
      Welcome to Geode! 
      </CardSummary> 
      </SummaryBox>
      <Card>
          <strong>GETTING STARTED...</strong><br /><br />
          <strong>Step 1:</strong>  
          <a href={'https://polkadot.js.org/extension/'}
                    target="_blank" 
                    rel="noopener noreferrer"
          > <strong> Get The "Polkadot" Chrome Extension </strong></a> <br /><br />
          <strong>Step 2: Use the extension to make an account</strong>  <br />
          With great freedom, comes great responsibility. Be sure to write down your secret phrase, account key, password and anything
          else. There is no centralized server keeping track of your account. That is up to YOU. Keep it safe! If you lose it, you cannot get it
          back again.<br /><br />
          <strong>Step 3: Buy some GEODE coin to use</strong> <br />
          Until GEODE is available on exchanges, you can buy it from people who already have it. This link allows you to buy GEODE
          directly from Sparticle Concepts LLC, the founders of Geode. This is a personal transaction between you and them. You can also
          buy GEODE coin from others on the network who are willing to sell. Discuss that directly with them.<br /><br />
          {'⚠️ IMPORTANT: By making a Geode account and using the applications, you certify that you are at least 18 years of age.'}<br />

      </Card>

      <SummaryBox>        
      <CardSummary label={''}>
          Buy Geode
      </CardSummary> 
      </SummaryBox>

      <Card>
      <Label circular color='orange'
          as='a' 
          href='https://kathryncolleen.com/studio/geode-blockchain/'
          target="_blank" 
          rel="noopener noreferrer"
          >
            {' Buy '}
          </Label>
          - Buy GEODE coin to use the apps here in the ecosystem, to increase your voting power on community decisions, to stake
          yourself as a validator or nominator, and to buy and sell products and services on the network. The GEODE coin is NOT a
          currency, security, or an investment of any kind and should not be used for speculation.<br />
      </Card>
      <SummaryBox>        
      <CardSummary label={''}>
          Geode Links
      </CardSummary> 
      </SummaryBox>
    <Card>
        <BlockandPurpose />
        <GeodeWhitePaper />
        <DiscordConnection />
        <SignUpForAnnouncements />
        <GoToGitHub />
    </Card>

    </div>
  );
}
