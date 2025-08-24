import { describe, it, expect } from 'vitest';
import * as fs from 'fs';

describe('Ticket Operations Unit Tests', () => {
    describe('Source Files', () => {
        it('should have ticket operations files', () => {
            expect(fs.existsSync('nodes/Luma/ticket/contracts.ts')).toBe(true);
            expect(fs.existsSync('nodes/Luma/ticket/operations.ts')).toBe(true);
            expect(fs.existsSync('nodes/Luma/ticket/props.ts')).toBe(true);
        });

        it('should have built ticket operation files', () => {
            expect(fs.existsSync('dist/nodes/Luma/ticket/contracts.js')).toBe(
                true
            );
            expect(fs.existsSync('dist/nodes/Luma/ticket/operations.js')).toBe(
                true
            );
            expect(fs.existsSync('dist/nodes/Luma/ticket/props.js')).toBe(true);
        });
    });

    describe('Ticket Interface Compilation', () => {
        it('should have ticket contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/ticket/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Ticket contracts compilation failed');
            }
        });

        it('should have ticket operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/ticket/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Ticket operations compilation failed');
            }
        });
    });

    describe('Ticket Properties Structure', () => {
        it('should have ticket operation properties', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            expect(Array.isArray(ticketProps)).toBe(true);
            expect(ticketProps.length).toBeGreaterThan(0);
        });

        it('should have ticket operation field', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });
    });

    describe('Ticket Constants', () => {
        it('should have ticket endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            // Check for common ticket endpoints
            expect(LUMA_ENDPOINTS.TICKET_TYPES_LIST).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_TYPES_LIST).toBe(
                '/public/v1/event/ticket-types/list'
            );
        });
    });
});
