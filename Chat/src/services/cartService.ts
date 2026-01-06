import axios from "../lib/axios";
import type { Cart, AddToCartData, UpdateCartItemData } from "../types/cart";

export const cartService = {
  // Lấy giỏ hàng
  getCart: async (): Promise<Cart> => {
    const response = await axios.get("/cart");
    return response.data.cart;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (data: AddToCartData): Promise<Cart> => {
    const response = await axios.post("/cart", data);
    return response.data.cart;
  },

  // Cập nhật số lượng sản phẩm
  updateCartItem: async (
    itemId: string,
    data: UpdateCartItemData
  ): Promise<Cart> => {
    const response = await axios.put(`/cart/${itemId}`, data);
    return response.data.cart;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await axios.delete(`/cart/${itemId}`);
    return response.data.cart;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<Cart> => {
    const response = await axios.delete("/cart");
    return response.data.cart;
  },
};
