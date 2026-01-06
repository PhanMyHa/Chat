import axios from "../lib/axios";
import type {
  Product,
  ProductFilters,
  ProductsResponse,
  Category,
} from "../types/product";

export const productService = {
  // Lấy danh sách sản phẩm với filters
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axios.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (id: string): Promise<Product> => {
    const response = await axios.get(`/products/${id}`);
    return response.data.product;
  },

  // Lấy danh mục
  getCategories: async (isActive?: boolean): Promise<Category[]> => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : "";
    const response = await axios.get(`/categories${params}`);
    return response.data.categories;
  },

  // Admin: Tạo sản phẩm
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await axios.post("/products", data);
    return response.data.product;
  },

  // Admin: Cập nhật sản phẩm
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await axios.put(`/products/${id}`, data);
    return response.data.product;
  },

  // Admin: Xóa sản phẩm
  deleteProduct: async (id: string): Promise<void> => {
    await axios.delete(`/products/${id}`);
  },

  // Admin: Lấy danh sách sản phẩm (bao gồm cả inactive)
  getProductsAdmin: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axios.get(`/products/admin/all?${params.toString()}`);
    return response.data;
  },

  // Admin: Tạo danh mục
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await axios.post("/categories", data);
    return response.data.category;
  },

  // Admin: Cập nhật danh mục
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await axios.put(`/categories/${id}`, data);
    return response.data.category;
  },

  // Admin: Xóa danh mục
  deleteCategory: async (id: string): Promise<void> => {
    await axios.delete(`/categories/${id}`);
  },
};
