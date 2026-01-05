import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { OrderItem } from "@/components/orders/OrderItem";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types/order";
import { toast } from "sonner";

export const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const filters: any = { page: currentPage, limit: 10 };
      if (statusFilter) filters.status = statusFilter;

      const response = await orderService.getUserOrders(filters);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      await orderService.cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
    }
  };

  const statuses: { value: OrderStatus | ""; label: string }[] = [
    { value: "", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipping", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant={statusFilter === status.value ? "default" : "outline"}
            onClick={() => {
              setStatusFilter(status.value);
              setCurrentPage(1);
            }}
          >
            {status.label}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
          <Button onClick={() => (window.location.href = "/products")}>
            Mua sắm ngay
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {orders.map((order) => (
              <OrderItem
                key={order._id}
                order={order}
                onCancel={handleCancelOrder}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="flex items-center px-4">
                Trang {currentPage} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={currentPage === pagination.pages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
