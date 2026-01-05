import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { orderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateOrderData, PaymentMethod } from "@/types/order";
import { toast } from "sonner";

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    paymentMethod: "cod" as PaymentMethod,
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData: CreateOrderData = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
        },
        paymentMethod: formData.paymentMethod,
        note: formData.note,
      };

      const order = await orderService.createOrder(orderData);
      await clearCart();
      toast.success("Đặt hàng thành công!");
      navigate(`/orders/${order._id}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <Button onClick={() => navigate("/products")}>
            Quay lại cửa hàng
          </Button>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Shipping Info */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Họ tên *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Thành phố *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="note">Ghi chú</Label>
                  <textarea
                    id="note"
                    className="w-full border rounded-md p-2 min-h-[80px]"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>

              <div className="space-y-3">
                {[
                  { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                  { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
                  { value: "momo", label: "Ví MoMo" },
                  { value: "vnpay", label: "VNPay" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as PaymentMethod,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.size} | x{item.quantity}
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        {(
                          (item.product.discountPrice || item.product.price) *
                          item.quantity
                        ).toLocaleString("vi-VN")}
                        ₫
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{total.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">
                    {total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
