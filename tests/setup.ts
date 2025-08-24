import '@testing-library/jest-dom';

// Simple globals for testing
global.NodeConnectionType = {
    Main: 'main'
};

global.NodeOperationError = class extends Error {
    constructor(node: any, message: string) {
        super(message);
        this.name = 'NodeOperationError';
    }
};
