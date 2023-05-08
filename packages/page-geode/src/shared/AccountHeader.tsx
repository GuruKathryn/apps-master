// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../translate';
import styled from 'styled-components';
import { Badge, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Item, Label } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    fromAcct: string;
    timeDate: Date;
    callFrom?: number;
    //outcome: CallResult;
    //onClose: () => void;
  }
  
function AccountHeader ({ className = '', onClear, fromAcct, timeDate, callFrom }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const [isShowInfo, toggleShowInfo] = useToggle(false);

function ListAccount(): JSX.Element {
  try {
    return (
      <div>
        <Item.Content>
          <Item.Header>
          <h2>
          <Badge
                icon={'info'}
                color={(isShowInfo) ? 'blue' : 'gray'}
                onClick={toggleShowInfo}/>

             <IdentityIcon size={32} value={fromAcct} />
             {' '}
             <AccountName value={fromAcct} withSidebar={true}/>
             <LabelHelp help={t<string>(' The account calling the information. ')} /> 
             </h2>
          </Item.Header>
          <Item.Meta>            
            
          </Item.Meta>
          <Item.Description> 
          
          {' '}{timeDate.toLocaleDateString()} 
          {' '}{timeDate.toLocaleTimeString()} 
          
          </Item.Description>
        </Item.Content>
        {isShowInfo && (
              <>
                {callFrom===1 ? (<>
                  <strong>{t<string>(' Key: ')}</strong>
                {t<string>(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>  
                {t<string>(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t<string>(' Endorse a Claim: ')}
                <Badge icon='thumbs-up' color='orange' /> 
                {t<string>(' Hide/Show a Claim: ')}
                <Badge icon='copy' color='orange' /> 
                </>) : 
                (<>
                <strong>{t<string>(' Key: ')}</strong>
                {t<string>(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>  
                {t<string>(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t<string>(' See Replies: ')}
                <Label color='blue'>{'Reply'}</Label>  
                {t<string>(' Copy Message ID: ')}
                <CopyInline value={' '} label={''}/>
                
                
                </>)}
              </>
            )}

      </div>
    )
  } catch(error) {
    console.error(error)
    //setIsClaim(false)
    return(
      <div>
          <strong>{t<string>('There are no posts available.')}</strong>
          <strong>{t<string>(' | Date/Time: ')}</strong>
            {' '}{timeDate.toLocaleDateString()} 
            {' '}{timeDate.toLocaleTimeString()} 
      </div>
    )
  }}

  
return (
    <StyledDiv className={className}>
    <Card>
    <ListAccount />
    </Card>
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
export default React.memo(AccountHeader);
