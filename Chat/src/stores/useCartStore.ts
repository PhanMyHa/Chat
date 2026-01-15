import { create } from "zustand";
import type { Cart, AddToCartData } from "../types/cart";
import { cartService } from "../services/cartService";
import { toast } from "sonner";

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartData) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.getCart();
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi tải giỏ hàng",
        isLoading: false,
      });
    }
  },

  addToCart: async (data: AddToCartData) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.addToCart(data);
      set({ cart, isLoading: false });
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
    
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.updateCartItem(itemId, { quantity });
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng");
    }
  },

  removeFromCart: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.removeFromCart(itemId);
      set({ cart, isLoading: false });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi xóa sản phẩm",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.clearCart();
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Lỗi khi xóa giỏ hàng",
        isLoading: false,
      });
    }
  },

  getCartItemsCount: () => {
    const { cart } = get();
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotal: () => {
    const { cart } = get();
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },
}));
