// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../translate';
import styled from 'styled-components';
import { Toggle, Badge, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Item, Label } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    fromAcct: string;
    timeDate: Date;
    callFrom?: number;
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
        <br />
        <Toggle
            className='info-toggle'
            label={<><strong>{t<string>(' Key: ')}</strong>
        {isShowInfo && (
              <>
                {(callFrom===1 || callFrom===2 || callFrom===0) && (<>
                {t<string>(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>  
                </>)}
                {(callFrom===1 || callFrom===0) && (<>
                {t<string>(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t<string>(' Endorse a Post: ')}
                <Badge icon='thumbs-up' color='blue' /> 
                {t<string>(' Copy a message ID: ')}
                <Badge icon='copy' color='orange' /> 
                </>)}
                {callFrom===2 && (<>
                {t<string>(' Copy a Address: ')}
                <Badge icon='copy' color='orange' /> 
                </>)}
                {callFrom===3 && (<>
                {t<string>(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>
                {t<string>(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t<string>(' See Replies: ')}
                <Label color='orange' circular >{'Replies #'}</Label>  
                {t<string>(' Endorse a Post: ')}
                <Badge icon='thumbs-up' color='blue' />
                {t<string>(' Copy Message ID: ')}
                <CopyInline value={' '} label={''}/>  
                {t<string>('Reply to a Post')}
                <Label color='orange' circular>{'Reply'}</Label>              
                </>)}
              </>
            )}
            
            
            
                      </>}
            onChange={toggleShowInfo}
            value={isShowInfo}
            />

      </div>
    )
  } catch(error) {
    console.error(error)
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
