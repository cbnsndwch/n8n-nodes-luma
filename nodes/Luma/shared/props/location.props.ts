import type { INodePropertyOptions, INodeProperties } from 'n8n-workflow';

// Location-specific field definitions

export const locationTypeOptions: INodePropertyOptions[] = [
    {
        name: 'Venue',
        value: 'venue'
    },
    {
        name: 'Online',
        value: 'online'
    },
    {
        name: 'TBD',
        value: 'tbd'
    }
];

export const locationTypeField: INodeProperties = {
    displayName: 'Location Type',
    name: 'locationType',
    type: 'options',
    options: locationTypeOptions,
    default: 'tbd',
    description: 'The type of location for the event'
};

export const locationNameField: INodeProperties = {
    displayName: 'Location Name',
    name: 'locationName',
    type: 'string',
    default: '',
    description: 'The name of the location'
};

export const locationAddressField: INodeProperties = {
    displayName: 'Location Address',
    name: 'locationAddress',
    type: 'string',
    default: '',
    description: 'The address of the location'
};

export const locationUrlField: INodeProperties = {
    displayName: 'Location URL',
    name: 'locationUrl',
    type: 'string',
    default: '',
    description: 'The URL for online events or venue links'
};
