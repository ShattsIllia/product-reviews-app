import type { Role } from '@shared';

export interface UserModel {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
}

export interface ReviewModel {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface ProductModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  averageRating: number | null;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  reviews?: ReviewModel[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
