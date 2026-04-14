import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USER_SEEDS = [
    {
        email: 'user1@example.com',
        password: 'password123',
        displayName: 'John Smith',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        role: 'USER' as const,
    },
    {
        email: 'user2@example.com',
        password: 'password123',
        displayName: 'Jane Doe',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        role: 'USER' as const,
    },
] as const;

const PRODUCT_SEEDS = [
    {
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        description: 'Latest flagship smartphone with A17 Pro chip',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
        category: 'Electronics',
    },
    {
        slug: 'macbook-pro-16',
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop for professionals',
        price: 1999,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        category: 'Electronics',
    },
    {
        slug: 'airpods-pro',
        name: 'AirPods Pro',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 249,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electronics',
    },
    {
        slug: 'javascript-book',
        name: "You Don't Know JS",
        description: 'In-depth JavaScript learning book series',
        price: 45,
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg',
        category: 'Books',
    },
    {
        slug: 'coffee-maker',
        name: 'Premium Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 89,
        imageUrl: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg',
        category: 'Home',
    },
    {
        slug: 'mechanical-keyboard',
        name: 'Mechanical Keyboard RGB',
        description: 'RGB mechanical keyboard with customizable switches',
        price: 149,
        imageUrl: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
        category: 'Electronics',
    },
] as const;

const REVIEW_SEEDS = [
    {
        userEmail: 'user1@example.com',
        productSlug: 'iphone-15-pro',
        rating: 5,
        comment: "Excellent phone! Best camera I've ever used.",
    },
    {
        userEmail: 'user2@example.com',
        productSlug: 'iphone-15-pro',
        rating: 4,
        comment: 'Great phone, a bit pricey but worth it.',
    },
    {
        userEmail: 'user1@example.com',
        productSlug: 'macbook-pro-16',
        rating: 5,
        comment: 'Perfect for development. Lightning fast!',
    },
    {
        userEmail: 'user2@example.com',
        productSlug: 'airpods-pro',
        rating: 4,
        comment: 'Noise cancellation is amazing.',
    },
] as const;

async function main() {
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const usersWithHashes = await Promise.all(
        USER_SEEDS.map(async (u) => ({
            email: u.email,
            passwordHash: await bcrypt.hash(u.password, 10),
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            role: u.role,
        })),
    );

    await prisma.user.createMany({ data: usersWithHashes });

    const users = await prisma.user.findMany({
        where: { email: { in: USER_SEEDS.map((u) => u.email) } },
        select: { id: true, email: true },
    });
    const userIdByEmail = new Map(users.map((u) => [u.email, u.id]));

    await prisma.product.createMany({ data: [...PRODUCT_SEEDS] });

    const products = await prisma.product.findMany({
        where: { slug: { in: PRODUCT_SEEDS.map((p) => p.slug) } },
        select: { id: true, slug: true },
    });
    const productIdBySlug = new Map(products.map((p) => [p.slug, p.id]));

    const reviewRows = REVIEW_SEEDS.map((r) => {
        const userId = userIdByEmail.get(r.userEmail);
        const productId = productIdBySlug.get(r.productSlug);
        if (!userId || !productId) {
            throw new Error(`Seed mismatch: user ${r.userEmail} or product ${r.productSlug} missing`);
        }
        return {
            userId,
            productId,
            rating: r.rating,
            comment: r.comment,
        };
    });

    await prisma.review.createMany({ data: reviewRows });

    const aggregates = await prisma.review.groupBy({
        by: ['productId'],
        _avg: { rating: true },
        _count: { id: true },
        _sum: { rating: true },
    });
    const statsByProduct = new Map(
        aggregates.map((a) => [
            a.productId,
            {
                avg: a._avg.rating,
                count: a._count.id,
                sum: a._sum.rating ?? 0,
            },
        ]),
    );

    await prisma.$transaction(
        products.map((p) => {
            const stats = statsByProduct.get(p.id);
            return prisma.product.update({
                where: { id: p.id },
                data: {
                    averageRating: stats?.avg ?? null,
                    reviewCount: stats?.count ?? 0,
                    ratingSum: stats?.sum ?? 0,
                },
            });
        }),
    );
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
