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
  // Tạo đơn hàng
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await axios.post("/orders", data);
    return response.data.order;
  },

  // Lấy danh sách đơn hàng của user
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

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: string): Promise<Order> => {
    const response = await axios.get(`/orders/${id}`);
    return response.data.order;
  },

  // Hủy đơn hàng
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await axios.put(`/orders/${id}/cancel`);
    return response.data.order;
  },

  // Admin: Lấy tất cả đơn hàng
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

  // Admin: Cập nhật trạng thái đơn hàng
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
