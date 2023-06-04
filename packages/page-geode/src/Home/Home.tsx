// Copyright 2017-2023 @blockandpurpose Home.tsx authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Grid, Segment, Image, Label } from 'semantic-ui-react';
//import { useApi } from '@polkadot/react-hooks';
import { Card, CardSummary, SummaryBox, LabelHelp } from '@polkadot/react-components';
import styled from 'styled-components';
import { useTranslation } from '../translate';
//import { useToggle } from '@polkadot/react-hooks';

import icon_lifeandwork from './geode_app_icon_lifeandwork.png';
import icon_market from './geode_app_icon_market.png';
import icon_messaging from './geode_app_icon_messaging.png';
import icon_private_exchange from './geode_app_icon_private_exchange.png';
import icon_profile from './geode_app_icon_profile.png';
import icon_referrals from './geode_app_icon_referrals.png';
import icon_social from './geode_app_icon_social.png';
import icon_sar from './geode_app_icon_sar.png';
import icon_music from './geode_app_icon_music.png';
import JSONhelp from './geode_home_info.json';

//import IPAddress from '../shared/IpAddress';
//import { Link } from 'react-router-dom';
//import useChainInfo from '../useChainInfo';
//import Extensions from './Extensions';
//import NetworkSpecs from './NetworkSpecs';

interface Props {
  className?: string;
}

export default function Home ({ className = ''}: Props): React.ReactElement {
const { t } = useTranslation();
const _help: string[] = JSONhelp;
//const [isShowIP, toggleShowIP] = useToggle(false);

const CardContainer = () => (
  <Grid columns={3}>
    <Grid.Column height={5}>
      <Segment raised textAlign='center' vertical height={5}>
      <h2>{t<string>('Step ')}
        <Label color='orange' circular size='huge'>1</Label></h2>
        <h2><strong>{t<string>(' Get The Polkadot ')}<br />
                    {t<string>(' Chrome Extension ')}</strong> 
        <LabelHelp help={t<string>(_help[9]+' '+_help[10])} /> </h2>
        <br />
        <Label color='blue' size='large'
        href={'https://polkadot.js.org/extension/'}
        target="_blank" 
        rel="noopener noreferrer">
        <h2>{t<string>('Click Here')}</h2>
        </Label>
      </Segment>
    </Grid.Column>

    <Grid.Column height={5}>
    <Segment raised textAlign='center' vertical height={5}>
      <h2>{t<string>('Step ')}
      <Label color='orange' circular size='huge'>2</Label></h2>
        <h2><strong>{t<string>(' Make a ')}<br />
                    {t<string>(' Geode Account ')}</strong> 
        <LabelHelp help={t<string>(_help[11]+' '+_help[12]+' '+_help[8])} /></h2>
        <br />
        
        <Label as='a' color='blue'
          hRef={'https://youtu.be/jO6ZSHQ8OpI'}
          target="_blank" 
          rel="noopener noreferrer">
          <h2>{t<string>('Watch Video')}</h2>
        </Label>
        
      </Segment>
    </Grid.Column>

    <Grid.Column height={5}>
    <Segment raised textAlign='center' vertical height={5}>
    <h2>{t<string>('Step ')}
      <Label color='orange' circular size='huge'>3</Label></h2>
        <h2><strong>{t<string>(' Get GEODE Coins ')} <br />
                    {t<string>(' to Use in the Ecosystem ')}</strong> 
        <LabelHelp help={t<string>(_help[6]+' '+_help[7])} /></h2>
        <br />
        <Label color='blue'
          as='a' 
          href='https://kathryncolleen.com/studio/geode-blockchain/'
          target="_blank" 
          rel="noopener noreferrer"
          >
            <h2>{t<string>(' Buy GEODE ')}</h2>
          </Label>
          <br />
      </Segment>
    </Grid.Column>
  </Grid>
)

const LinkContainer = () => {
  return(
  <div>
    <Grid columns={6} textAlign={'left'}>
    <Grid.Row stretched >
      <Grid.Column width={1}>
        <Image src={icon_lifeandwork} size='tiny'
            href={'#/geode/lifeAndWork'}>
        </Image> 
      </Grid.Column >
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t<string>('Life and Work')}</strong></h2>
        {_help[0]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_profile} size='tiny'
            href={'#/geode/profile'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t<string>('Profile')}</strong></h2>
        {_help[1]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_social} size='tiny'
            href={'#/geode/social'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t<string>('Social')}</strong></h2>
        {_help[3]}
      </Grid.Column>

      </Grid.Row>
      <Grid.Row stretched>

      <Grid.Column width={1}>
      <Image src={icon_messaging} size='tiny'
            href={'#/geode/messaging'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t<string>('Messaging')}</strong></h2>
        {_help[4]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_market} size='tiny'
            href={'#/geode/market'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t<string>('Market')}</strong></h2>
        {_help[2]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_referrals} size='tiny'
            href={'#/geode/referrals'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={5}>
        <h2><strong>{t<string>('Referrals')}</strong></h2>
        {_help[14]}
      </Grid.Column>
      </Grid.Row>

      <Grid.Row stretched>
      <Grid.Column width={1}>
      <Image src={icon_private_exchange} size='tiny'
            href={'#/geode/privateexchange'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t<string>('Private Exchange')}</strong></h2>
        {_help[13]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_sar} size='tiny'
            href={'#/geode/reporting'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={5}>
        <h2><strong>{t<string>('Reporting')}</strong></h2>
        {_help[5]}
      </Grid.Column>

      </Grid.Row>
    </Grid>
    </div>
  )
}

const ButtonContainer = () => {
  return(
    <div>
      <Label as='a' color='orange' size='huge'
          hRef={'https://blockandpurpose.com/announcements/'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t<string>(' Announcements ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          hRef={'https://discord.com/invite/2v4DPxDQXt'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t<string>(' Discord ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          hRef={'http://geodechain.com/'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t<string>(' Help & Info ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          hRef={'http://geodechain.com/wp-content/uploads/2023/04/Geode-Blockchain-Whitepaper-V2023_03_20.pdf'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t<string>(' Whitepaper ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          hRef={'http://geodechain.com/tos/'}
          target="_blank"
          rel="noopener noreferrer"
          >
          <h2>{t<string>(' TOS ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          hRef={'https://github.com/SparticleConcepts'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t<string>(' GitHub ')}</h2>
      </Label>

    </div>
  )
}


  return (
  <StyledDiv className={className}>
    <div>
      <SummaryBox>        
        <CardSummary label={''}>
          {t<string>(' Welcome to Geode! - Getting Started ')}
        </CardSummary> 
      </SummaryBox>

      <Card>
        <CardContainer />
      </Card>
    
      <SummaryBox>        
        <CardSummary label={''}>
          {t<string>(' Geode Ecosystem ')}
        </CardSummary> 
      </SummaryBox>

      <Card>
        <LinkContainer/>
      </Card>

      <SummaryBox>        
        <CardSummary label={''}>
          {t<string>(' Useful Links ')}
        </CardSummary> 
      </SummaryBox>

      <Card>
        <ButtonContainer />
      </Card>
    </div>
  </StyledDiv>

  );
}

const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;

//width="425" height="300" 