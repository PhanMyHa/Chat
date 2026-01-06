import type { Order } from "@/types/order";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface OrderItemProps {
  order: Order;
  onCancel?: (orderId: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  shipping: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export const OrderItem = ({ order, onCancel }: OrderItemProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm text-gray-600">
              Mã đơn: #{order._id.slice(-8)}
            </div>
            <div className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
          <Badge className={statusColors[order.status]}>
            {statusLabels[order.status]}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex gap-3">
              <img
                src={
                  typeof item.product === "object"
                    ? item.product.images[0]
                    : "/placeholder.jpg"
                }
                alt="Product"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">
                  {typeof item.product === "object"
                    ? item.product.name
                    : "Sản phẩm"}
                </div>
                <div className="text-sm text-gray-600">
                  Size: {item.size} | SL: {item.quantity}
                </div>
                <div className="text-sm font-semibold text-red-600">
                  {item.price.toLocaleString("vi-VN")}₫
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Tổng tiền:</span>
            <span className="text-xl font-bold text-red-600">
              {order.totalAmount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/orders/${order._id}`}>Xem chi tiết</Link>
          </Button>
          {order.status === "pending" && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(order._id)}
              className="flex-1"
            >
              Hủy đơn
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
