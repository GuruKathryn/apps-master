// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button, Card } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useContracts } from '../useContracts';
import ContractsTable from './ContractsTable';
import { useCodes } from '../useCodes';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function ClaimType ({ className = '' }: Props): React.ReactElement {
const { t } = useTranslation();
// static test const
const { allContracts } = useContracts();
const { allCodes, codeTrigger } = useCodes();
console.log(JSON.stringify(allCodes));

const [isExpertise, toggleIsExpertise] = useToggle();
const [isEducation, toggleIsEducation] = useToggle();
const [isWorkHistory, toggleIsWorkHistory] = useToggle();
const [isGoodDeed, toggleIsGoodDeed] = useToggle();
const [isIP, toggleIsIP] = useToggle();

  return (
    <div>
    <Card>
    <Button
                icon={(isExpertise) ? 'minus' : 'plus'}
                label={t<string>('Expertise')}
                onClick={toggleIsExpertise}>
    </Button>
    <Button
                icon={(isWorkHistory) ? 'minus' : 'plus'}
                label={t<string>('Work History')}
                onClick={toggleIsWorkHistory}>
    </Button>
    <Button
                icon={(isEducation) ? 'minus' : 'plus'}
                label={t<string>('Education')}
                onClick={toggleIsEducation}>
    </Button>
    <Button
                icon={(isGoodDeed) ? 'minus' : 'plus'}
                label={t<string>('Good Deed')}
                onClick={toggleIsGoodDeed}>
    </Button>
    <Button
                icon={(isIP) ? 'minus' : 'plus'}
                label={t<string>('Intellectual Property')}
                onClick={toggleIsIP}>
    </Button>

    </Card>
    {isExpertise && (
          <div>
              <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={0}
                />   
          </div>
        )}
    {isWorkHistory && (
          <div>
              <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={1}
                />   
          </div>
        )}
    {isEducation && (
          <div>
              <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={2}
                />   
          </div>
        )}
    {isGoodDeed && (
          <div>
              <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={3}
                />   
          </div>
        )}
    {isIP && (
          <div>
              <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={4}
                />   
          </div>
        )}
    </div>
  );
}

export default React.memo(ClaimType);
