export type Role = 'USER' | 'ADMIN';

export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    role: Role;
}

// When returned from API lists/details, dates are typically serialized.
export interface User extends UserProfile {
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number | string;
    imageUrl: string;
    category: string;
    averageRating: number | null;
    reviewCount: number;
    /** Denormalized sum of ratings; included in API payloads when present */
    ratingSum?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string | null;
    createdAt?: string;
    updatedAt?: string;
    user?: {
        displayName: string;
        avatarUrl: string | null;
    };
}

export interface AuthResponse {
    accessToken: string;
}

export interface RegistrationResponse {
    message: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateReviewInput {
    rating: number;
    comment?: string;
}

export interface UpdateReviewInput {
    rating?: number;
    comment?: string;
}

export interface UpdateUserInput {
    displayName?: string;
    avatarUrl?: string | null;
}
