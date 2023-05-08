// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
//import styled from 'styled-components';

import { useQueue } from '@polkadot/react-hooks';
import { isString } from '@polkadot/util';

import { Button, Badge} from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  label?: React.ReactNode;
  type?: string;
  isMnemonic?: boolean;
  value?: React.ReactNode | null;
}

const NOOP = () => undefined;

function CopyInline ({ children, className = '', icon = 'copy', label, type, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueAction } = useQueue();

  const _onCopy = useCallback(
    (): void => {
      queueAction && queueAction({
        action: t<string>('clipboard'),
        message: t<string>('{{type}} copied', { replace: { type: type || t<string>('value') } }),
        status: 'queued'
      });
    },
    [type, queueAction, t]
  );

  if (!isString(value)) {
    return null;
  }

  return (

      <CopyToClipboard
        onCopy={_onCopy}
        text={value as string}
      >
            <Badge
              className='icon-button show-on-hover'
              icon={icon}
              color={'orange'}
              //isDisabled={!value}
              //label={label}
              onClick={NOOP}
            />   
      </CopyToClipboard>
  );
}

export default React.memo(CopyInline);
