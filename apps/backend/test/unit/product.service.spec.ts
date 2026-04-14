import { ProductService } from '../../src/features/products/product.service';
import { ProductRepository } from '../../src/features/products/product.repository';
import { NotFoundException } from '../../src/common/exceptions/app.exception';
import type { Product } from '@prisma/client';

describe('ProductService (unit)', () => {
    let service: ProductService;
    let productRepository: jest.Mocked<Pick<ProductRepository, 'findById' | 'findMany' | 'findCategories'>>;

    beforeEach(() => {
        productRepository = {
            findById: jest.fn(),
            findMany: jest.fn(),
            findCategories: jest.fn(),
        };
        service = new ProductService(productRepository as unknown as ProductRepository);
        jest.clearAllMocks();
    });

    it('getProducts: passes pagination + filters to repository', async () => {
        productRepository.findMany.mockResolvedValue({
            products: [{ id: 'p1' } as unknown as Product],
            total: 1,
        });

        const res = await service.getProducts(2, 12, 'iphone', 'Electronics');

        expect(productRepository.findMany).toHaveBeenCalledWith(2, 12, 'iphone', 'Electronics');
        expect(res.total).toBe(1);
        expect(res.data).toEqual([{ id: 'p1' }]);
    });

    it('getProductById: throws NotFoundException when missing', async () => {
        productRepository.findById.mockResolvedValue(null);

        await expect(service.getProductById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('getCategories: returns distinct category list', async () => {
        productRepository.findCategories.mockResolvedValue([
          { category: 'Books' },
          { category: 'Electronics' },
        ]);

        const res = await service.getCategories();

        expect(res).toEqual(['Books', 'Electronics']);
        expect(productRepository.findCategories).toHaveBeenCalled();
    });
});
