export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  size: string;
  stock: number;
  _id?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string | Category;
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  totalSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  isFeatured?: boolean;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}
