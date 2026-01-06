import { create } from "zustand";
import type { Product, ProductFilters, Category } from "../types/product";
import { productService } from "../services/productService";

interface ProductStore {
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;

  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProducts(filters);
      set({
        products: response.products,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi tải sản phẩm",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ selectedProduct: product, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi tải sản phẩm",
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories(true);
      set({ categories });
    } catch (error: any) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  },

  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },
}));
