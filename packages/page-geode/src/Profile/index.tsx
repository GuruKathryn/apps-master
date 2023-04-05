// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Table } from '@polkadot/react-components';

import Summary from './Summary';
import Details from './Details';

export default function Profile (): React.ReactElement {

  return (
    <div>
        <Table >
            <Summary />
            <Details />           
        </Table>
    </div>
  );
}
