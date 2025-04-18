import { AzureIcon } from '~/common/components/icons/vendors/AzureIcon';

import type { IModelVendor } from '../IModelVendor';
import type { OpenAIAccessSchema } from '../../server/openai/openai.router';

import { ModelVendorOpenAI } from '../openai/openai.vendor';

import { AzureDeepseekServiceSetup } from './AzureDeepseekServiceSetup';


// special symbols
export const isValidAzureApiKey = (apiKey?: string) => !!apiKey && apiKey.length >= 32;

export interface DAzureDeepseekServiceSettings {
  azureEndpoint: string;
  azureKey: string;
}

export const ModelVendorAzureDeepseek: IModelVendor<DAzureDeepseekServiceSettings, OpenAIAccessSchema> = {
  id: 'azuredeepseek',
  name: 'Azure DeepSeek',
  displayRank: 31,
  location: 'cloud',
  instanceLimit: 20,
  hasServerConfigKey: 'hasLlmAzureDeepseek',

  // components
  Icon: AzureIcon,
  ServiceSetupComponent: AzureDeepseekServiceSetup,

  // functions
  getTransportAccess: (partialSetup): OpenAIAccessSchema => ({
    dialect: 'azuredeepseek',
    oaiKey: partialSetup?.azureKey || '',
    oaiOrg: '',
    oaiHost: partialSetup?.azureEndpoint || '',
    heliKey: '',
    moderationCheck: false,
  }),

  // OpenAI transport ('azuredeepseek' dialect in 'access')
  rpcUpdateModelsOrThrow: ModelVendorOpenAI.rpcUpdateModelsOrThrow,
};