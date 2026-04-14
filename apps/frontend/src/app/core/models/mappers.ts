import type { PaginatedResponseDto, ProductDto, ReviewDto, UserDto } from './api';
import type { Paginated, ProductModel, ReviewModel, UserModel } from './models';

function toDate(value: unknown): Date | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function mapUserDto(u: UserDto): UserModel {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl ?? null,
    role: u.role,
  };
}

export function mapReviewDto(r: ReviewDto): ReviewModel {
  return {
    id: r.id,
    userId: r.userId,
    productId: r.productId,
    rating: r.rating,
    comment: r.comment ?? null,
    createdAt: toDate(r.createdAt),
    updatedAt: toDate(r.updatedAt),
    user: r.user,
  };
}

export function mapProductDto(p: ProductDto): ProductModel {
  const reviews = (p as unknown as { reviews?: ReviewDto[] }).reviews;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: toNumber(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    averageRating: p.averageRating ?? null,
    reviewCount: p.reviewCount ?? 0,
    createdAt: toDate(p.createdAt),
    updatedAt: toDate(p.updatedAt),
    reviews: Array.isArray(reviews) ? reviews.map(mapReviewDto) : undefined,
  };
}

export function mapPaginated<TDto, TModel>(
  res: PaginatedResponseDto<TDto>,
  mapItem: (x: TDto) => TModel
): Paginated<TModel> {
  return {
    data: res.data.map(mapItem),
    total: res.total,
    page: res.page,
    limit: res.limit,
  };
}
