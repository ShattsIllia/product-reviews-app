import type { PrismaClient } from '@prisma/client';

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type PrismaMock = {
    [K in keyof PrismaClient]?: any;
};

export function createPrismaMock(overrides: DeepPartial<PrismaMock> = {}): PrismaMock {
    const base: PrismaMock = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        product: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
        },
        review: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            upsert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            aggregate: jest.fn(),
        },
    };

    return {
        ...base,
        ...overrides,
    };
}

