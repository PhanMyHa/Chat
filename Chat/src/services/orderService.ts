import axios from "../lib/axios";
import type  {
  Order,
  CreateOrderData,
  OrderFilters,
  OrdersResponse,
  OrderStatus,
  PaymentStatus,
} from "../types/order";

export const orderService = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await axios.post("/orders", data);
    return response.data.order;
  },


  createOrderWithVNPay: async (data: CreateOrderData): Promise<{ order: Order; paymentUrl: string }> => {
    const response = await axios.post("/orders/vnpay", data);
    return response.data;
  },


  verifyVNPayPayment: async (queryParams: string): Promise<{ success: boolean; order?: Order; message: string }> => {
    const response = await axios.get(`/orders/vnpay/return?${queryParams}`);
    return response.data;
  },


  getUserOrders: async (filters?: OrderFilters): Promise<OrdersResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axios.get(`/orders/my-orders?${params.toString()}`);
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await axios.get(`/orders/${id}`);
    return response.data.order;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await axios.put(`/orders/${id}/cancel`);
    return response.data.order;
  },

  getAllOrders: async (filters?: OrderFilters): Promise<OrdersResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axios.get(`/orders/admin/all?${params.toString()}`);
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    status?: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Promise<Order> => {
    const response = await axios.put(`/orders/${id}/status`, {
      status,
      paymentStatus,
    });
    return response.data.order;
  },
};
