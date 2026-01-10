import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { orderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import type { CreateOrderData, PaymentMethod } from "@/types/order";
import { toast } from "sonner";
import { HomeHeader } from "@/components/home/HomeHeader";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Wallet,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";

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
      toast.success("Đặt hàng thành công!", {
        description: "Cảm ơn bạn đã mua sắm tại ShopQuanAo.",
      });
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
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
        <HomeHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Giỏ hàng đang trống
          </h2>
          <Button
            onClick={() => navigate("/products")}
            className="rounded-full bg-zinc-900 text-white hover:bg-rose-500 px-8 h-12"
          >
            Quay lại cửa hàng
          </Button>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  const paymentMethods = [
    {
      id: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      icon: Truck,
      desc: "Thanh toán tiền mặt khi giao hàng",
    },
    {
      id: "bank_transfer",
      label: "Chuyển khoản ngân hàng",
      icon: Banknote,
      desc: "VietQR / Internet Banking",
    },
    {
      id: "momo",
      label: "Ví MoMo",
      icon: Wallet,
      desc: "Cổng thanh toán MoMo",
    },
    {
      id: "vnpay",
      label: "VNPay",
      icon: CreditCard,
      desc: "Thẻ ATM / QR Code",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 font-sans pb-20">
      <HomeHeader />

      <main className="container mx-auto px-6 py-10">
        <div className="mb-10 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            className="rounded-full hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
              Thanh{" "}
              <span className="font-serif italic font-light text-rose-500">
                toán
              </span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Thông tin giao hàng</h2>
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-xs uppercase font-bold text-zinc-400 tracking-wider"
                      >
                        Họ tên
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          id="fullName"
                          required
                          placeholder="Nguyễn Văn A"
                          className="pl-10 h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-xs uppercase font-bold text-zinc-400 tracking-wider"
                      >
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="0909 xxx xxx"
                          className="pl-10 h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-xs uppercase font-bold text-zinc-400 tracking-wider"
                    >
                      Địa chỉ nhận hàng
                    </Label>
                    <Input
                      id="address"
                      required
                      placeholder="Số nhà, tên đường..."
                      className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-xs uppercase font-bold text-zinc-400 tracking-wider"
                      >
                        Tỉnh / Thành phố
                      </Label>
                      <Input
                        id="city"
                        required
                        placeholder="TP. Hồ Chí Minh"
                        className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="district"
                        className="text-xs uppercase font-bold text-zinc-400 tracking-wider"
                      >
                        Quận / Huyện
                      </Label>
                      <Input
                        id="district"
                        required
                        placeholder="Quận 1"
                        className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="note"
                      className="text-xs uppercase font-bold text-zinc-400 tracking-wider"
                    >
                      Ghi chú đơn hàng (Tùy chọn)
                    </Label>
                    <Textarea
                      id="note"
                      placeholder="Ví dụ: Giao hàng giờ hành chính..."
                      className="min-h-[100px] rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all resize-none"
                      value={formData.note}
                      onChange={( e: any) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => {
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentMethod: method.id as PaymentMethod,
                          })
                        }
                        className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? "border-rose-500 bg-rose-50/30 shadow-md shadow-rose-100"
                            : "border-zinc-100 bg-white hover:border-zinc-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-rose-500 text-white"
                                : "bg-zinc-100 text-zinc-500"
                            }`}
                          >
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3
                              className={`font-bold text-sm mb-1 ${
                                isSelected ? "text-rose-700" : "text-zinc-900"
                              }`}
                            >
                              {method.label}
                            </h3>
                            <p className="text-xs text-zinc-500 leading-tight">
                              {method.desc}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-rose-500">
                            <CheckCircle2 className="w-5 h-5 fill-rose-100" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-xl shadow-zinc-200/50"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Đơn hàng của bạn
                  <span className="text-sm font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {cart.items.length} món
                  </span>
                </h2>

                <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2 scrollbar-hide">
                  {cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 items-start group"
                    >
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 line-clamp-2 leading-tight mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mb-2">
                          Size: {item.size} • Màu: {item.color}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium bg-zinc-100 px-2 py-1 rounded text-zinc-600">
                            x{item.quantity}
                          </span>
                          <span className="text-sm font-bold text-rose-600">
                            {(
                              (item.product.discountPrice ||
                                item.product.price) * item.quantity
                            ).toLocaleString("vi-VN")}
                            ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative h-4 w-full overflow-hidden mb-6">
                  <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-zinc-200"></div>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAFAF9] rounded-full"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAFAF9] rounded-full"></div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-zinc-600">
                    <span>Tạm tính</span>
                    <span className="font-medium text-zinc-900">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-base font-bold text-zinc-900">
                      Tổng cộng
                    </span>
                    <div className="text-right">
                      <span className="block text-2xl font-black text-rose-600 tracking-tight">
                        {total.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-zinc-900 text-white hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-200 transition-all duration-300 text-base font-bold tracking-wide"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Xác nhận đặt hàng
                    </span>
                  )}
                </Button>

                <p className="text-[10px] text-zinc-400 text-center mt-4">
                  Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý với điều khoản
                  dịch vụ của chúng tôi.
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
