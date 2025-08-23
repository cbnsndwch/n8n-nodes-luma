import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LumaApi implements ICredentialType {
  name = 'lumaApi';
  displayName = 'Luma API';
  documentationUrl = 'https://docs.lu.ma/';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];
}