import type {
    IDataObject,
    IExecuteFunctions,
    IHttpRequestMethods,
    INodeExecutionData
} from 'n8n-workflow';

export interface LumaApiRequest {
    method: IHttpRequestMethods;
    url: string;
    qs?: IDataObject;
    body?: IDataObject;
}

export interface LumaOperationContext {
    executeFunctions: IExecuteFunctions;
    itemIndex: number;
}

export type ResourceHandler = (
    operation: string,
    context: LumaOperationContext
) => Promise<INodeExecutionData | INodeExecutionData[]>;

export type OperationHandler = (
    context: LumaOperationContext
) => Promise<INodeExecutionData | INodeExecutionData[]>;

export interface LocationData extends IDataObject {
    type: string;
    name?: string;
    address?: string;
    url?: string;
}
