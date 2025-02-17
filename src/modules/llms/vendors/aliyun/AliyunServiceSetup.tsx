import * as React from 'react';

import { Alert } from '@mui/joy';

import type { DModelsServiceId } from '~/common/stores/llms/llms.service.types';
import { AlreadySet } from '~/common/components/AlreadySet';
import { Brand } from '~/common/app.config';
import { FormInputKey } from '~/common/components/forms/FormInputKey';
import { FormSwitchControl } from '~/common/components/forms/FormSwitchControl';
import { FormTextField } from '~/common/components/forms/FormTextField';
import { InlineError } from '~/common/components/InlineError';
import { Link } from '~/common/components/Link';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';
import { useToggleableBoolean } from '~/common/util/hooks/useToggleableBoolean';

import { ApproximateCosts } from '../ApproximateCosts';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useServiceSetup } from '../useServiceSetup';

import { ModelVendorAliyun } from './aliyun.vendor';


// avoid repeating it all over
const HELICONE_OPENAI_HOST = 'oai.hconeai.com';
const ALIYUN_API_HOST = 'https://dashscope.aliyuncs.com/compatible-mode';


export function AliyunServiceSetup(props: { serviceId: DModelsServiceId }) {

  // state
  const advanced = useToggleableBoolean(!!props.serviceId?.includes('-'));

  // external state
  const { service, serviceAccess, serviceHasBackendCap, serviceHasLLMs, updateSettings } =
    useServiceSetup(props.serviceId, ModelVendorAliyun);

  // derived state
  const { oaiKey, oaiOrg, oaiHost, heliKey, moderationCheck } = serviceAccess;
  const needsUserKey = !serviceHasBackendCap;

  const keyValid = true; //isValidOpenAIApiKey(oaiKey);
  const keyError = (/*needsUserKey ||*/ !!oaiKey) && !keyValid;
  const shallFetchSucceed = oaiKey ? keyValid : !needsUserKey;

  // fetch models
  const { isFetching, refetch, isError, error } =
    useLlmUpdateModels(!serviceHasLLMs && shallFetchSucceed, service);

  return <>

    <ApproximateCosts serviceId={service?.id} />

    <FormInputKey
      autoCompleteId='openai-key' label='API Key'
      rightLabel={<>{needsUserKey
        ? !oaiKey && <Link level='body-sm' href='https://platform.openai.com/account/api-keys' target='_blank'>create key</Link>
        : <AlreadySet />
      } {oaiKey && keyValid && <Link level='body-sm' href='https://platform.openai.com/account/usage' target='_blank'>check usage</Link>}
      </>}
      value={oaiKey} onChange={value => updateSettings({ oaiKey: value })}
      required={needsUserKey} isError={keyError}
      placeholder='sk-...'
    />

    {advanced.on && <FormTextField
      autoCompleteId='openai-host'
      title='API Endpoint'
      tooltip={`An OpenAI compatible endpoint to be used in place of 'api.openai.com'.\n\nCould be used for Helicone, Cloudflare, or other OpenAI compatible cloud or local services.\n\nExamples:\n - ${HELICONE_OPENAI_HOST}\n - localhost:1234`}
      description={<><Link level='body-sm' href='https://www.helicone.ai' target='_blank'>Helicone</Link>, <Link level='body-sm' href='https://developers.cloudflare.com/ai-gateway/' target='_blank'>Cloudflare</Link></>}
      placeholder={ALIYUN_API_HOST}
      value={oaiHost || ALIYUN_API_HOST}
      onChange={text => updateSettings({ oaiHost: text })}
    />}

    {advanced.on && <FormTextField
      autoCompleteId='openai-org'
      title='Organization ID'
      description={<Link level='body-sm' href={Brand.URIs.OpenRepo + '/issues/63'} target='_blank'>What is this</Link>}
      placeholder='Optional, for enterprise users'
      value={oaiOrg}
      onChange={text => updateSettings({ oaiOrg: text })}
    />}

    {advanced.on && <FormSwitchControl
      title='Moderation' on='Enabled' fullWidth
      description={<>
        <Link level='body-sm' href='https://platform.openai.com/docs/guides/moderation/moderation' target='_blank'>Overview</Link>,
        {' '}<Link level='body-sm' href='https://openai.com/policies/usage-policies' target='_blank'>policy</Link>
      </>}
      checked={moderationCheck}
      onChange={on => updateSettings({ moderationCheck: on })}
    />}

    <SetupFormRefetchButton refetch={refetch} disabled={isFetching} error={isError} loading={isFetching} advanced={advanced} />

    {isError && <InlineError error={error} />}

  </>;
}
