import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties
} from 'n8n-workflow';
import { LUMA_API_BASE_URL, LUMA_ENDPOINTS } from '../nodes/Luma/utils/constants';

export class LumaApi implements ICredentialType {
    name = 'lumaApi';
    displayName = 'Luma API';
    // Note: credentials don't support icon property in the same way as nodes
    
    documentationUrl = 'https://docs.lu.ma/api/getting-started';

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true
            },
            default: '',
            description: 'Your Luma API key'
        }
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'x-luma-api-key': '={{ $credentials.apiKey }}'
            }
        }
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: LUMA_API_BASE_URL,
            url: LUMA_ENDPOINTS.USER_GET_SELF,
            method: 'GET'
        }
    };
}
