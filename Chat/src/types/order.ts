import type { Product } from "./product";

export interface OrderItem {
  _id?: string;
  product: string | Product;
  quantity: number;
  size: string;
  color?: string;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "bank_transfer" | "momo" | "vnpay";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
