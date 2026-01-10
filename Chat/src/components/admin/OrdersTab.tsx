import { useState, useEffect } from "react";
import { orderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { OrderStatus } from "@/types/order";
import { CheckCircle, XCircle, Truck, Package } from "lucide-react";
import { toast } from "sonner";

export const OrdersTab = ({ refreshStats }: { refreshStats: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const filters: any = { page, limit: 10 };
      if (statusFilter) filters.status = statusFilter;
      const response = await orderService.getAllOrders(filters);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success("Cập nhật trạng thái thành công");
      fetchOrders();
      refreshStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipping: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    const labels: any = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { value: "", label: "Tất cả" },
            { value: "pending", label: "Chờ xử lý" },
            { value: "confirmed", label: "Đã xác nhận" },
            { value: "shipping", label: "Đang giao" },
            { value: "delivered", label: "Đã giao" },
            { value: "cancelled", label: "Đã hủy" },
          ].map((status) => (
            <Button
              key={status.value}
              size="sm"
              variant={statusFilter === status.value ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(status.value as OrderStatus | "");
                setPage(1);
              }}
              className="whitespace-nowrap"
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Đang tải dữ liệu...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {orders.map((order) => (
            <Card key={order._id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ngày đặt:{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")} •
                    Khách hàng: {order.user?.displayName || "N/A"}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <div className="text-lg font-bold text-rose-600">
                    {order.totalAmount.toLocaleString("vi-VN")}₫
                  </div>
                  <div className="text-xs text-gray-400 uppercase">
                    {order.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm space-y-2">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex justify-between">
                    <span>
                      {item.product?.name || "Sản phẩm đã xóa"}{" "}
                      <span className="text-gray-500">
                        x{item.quantity} ({item.size})
                      </span>
                    </span>
                    <span className="font-medium">
                      {item.price.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <div className="flex gap-2 justify-end">
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order._id, "confirmed")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận
                    </Button>
                  )}
                  {order.status === "confirmed" && (
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleUpdateStatus(order._id, "shipping")}
                    >
                      <Truck className="w-4 h-4 mr-2" /> Giao hàng
                    </Button>
                  )}
                  {order.status === "shipping" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus(order._id, "delivered")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Hoàn tất
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(order._id, "cancelled")}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Hủy đơn
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="flex items-center px-4 text-sm font-medium">
            Trang {page} / {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
};
