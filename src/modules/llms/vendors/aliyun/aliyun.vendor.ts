import { AliyunIcon } from '~/common/components/icons/vendors/AliyunIcon';
import { apiAsync } from '~/common/util/trpc.client';

import type { IModelVendor } from '../IModelVendor';
import { ModelVendorOpenAI } from '../openai/openai.vendor';
import type { OpenAIAccessSchema } from '../../server/openai/openai.router';
import { AliyunServiceSetup } from './AliyunServiceSetup';
import { LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Reasoning } from '~/common/stores/llms/llms.types';


// special symbols
// export const isValidOpenAIApiKey = (apiKey?: string) => !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 40;

export interface DAliyunServiceSettings {
  oaiKey: string;
  oaiOrg: string;
  oaiHost: string;  // use OpenAI-compatible non-default hosts (full origin path)
  moderationCheck: boolean;
}

export const ModelVendorAliyun: IModelVendor<DAliyunServiceSettings, OpenAIAccessSchema> = {
  id: 'aliyun',
  name: 'Aliyun',
  displayRank: 36,
  location: 'cloud',
  instanceLimit: 5,
  hasServerConfigKey: 'hasLlmAliyun',

  // components
  Icon: AliyunIcon,
  ServiceSetupComponent: AliyunServiceSetup,

  // functions
  getTransportAccess: (partialSetup): OpenAIAccessSchema => ({
    dialect: 'aliyun',
    oaiKey: '',
    oaiOrg: '',
    oaiHost: '',
    heliKey: '',
    moderationCheck: false,
    ...partialSetup,
  }),

  // List Models
  rpcUpdateModelsOrThrow: ModelVendorOpenAI.rpcUpdateModelsOrThrow,

};
