import type  { Product } from "./product";

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size: string;
  color?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  size: string;
  color?: string;
}

export interface UpdateCartItemData {
  quantity: number;
}
