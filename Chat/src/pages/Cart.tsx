import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HomeHeader } from "@/components/home/HomeHeader"; 
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CreditCard,
  TicketPercent,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    isLoading,
    fetchCart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total = getCartTotal();
  const FREE_SHIPPING_THRESHOLD = 500000;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShip = FREE_SHIPPING_THRESHOLD - total;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Cart...
          </p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
        <HomeHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <ShoppingBag className="w-14 h-14 text-rose-300" />
              <div className="absolute top-2 right-4 w-4 h-4 bg-rose-400 rounded-full animate-ping" />
            </div>

            <h2 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">
              Giỏ hàng đang{" "}
              <span className="text-rose-500 font-serif italic font-light">
                trống trơn
              </span>
            </h2>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              Có vẻ như bạn chưa chọn được món đồ ưng ý nào. Hãy ghé qua bộ sưu
              tập mới nhất của chúng mình nhé!
            </p>

            <Button
              onClick={() => navigate("/products")}
              className="rounded-full px-8 py-6 bg-black text-white hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-zinc-200 text-base font-bold"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Quay lại cửa hàng
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 font-sans pb-20">
      <HomeHeader />

      <main className="container mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tighter"
            >
              Shopping{" "}
              <span className="font-serif italic font-light text-rose-500">
                Cart
              </span>
            </motion.h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Bạn có{" "}
              <span className="font-bold text-zinc-900">
                {cart.items.length}
              </span>{" "}
              sản phẩm trong giỏ hàng
            </p>
          </div>

          <Button
            variant="link"
            onClick={() => navigate("/products")}
            className="text-zinc-500 hover:text-rose-500 p-0 h-auto font-medium"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Tiếp tục mua sắm
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3 text-sm">
                <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                  <Truck className="w-4 h-4" />
                </div>
                {remainingForFreeShip > 0 ? (
                  <span>
                    Mua thêm{" "}
                    <span className="font-bold text-rose-500">
                      {remainingForFreeShip.toLocaleString("vi-VN")}₫
                    </span>{" "}
                    để được{" "}
                    <span className="font-bold uppercase text-rose-500">
                      Freeship
                    </span>
                  </span>
                ) : (
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    Chúc mừng! Bạn đã được Freeship{" "}
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-rose-400 to-rose-600 rounded-full"
                />
              </div>
            </motion.div>

            <div className="space-y-4">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    layout
                    className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow"
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateCartItem}
                      onRemove={removeFromCart}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-xl shadow-zinc-200/50"
            >
              <h2 className="text-xl font-bold mb-6 font-serif">
                Tóm tắt đơn hàng
              </h2>

              <div className="mb-6">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Nhập mã voucher"
                      className="pl-9 bg-zinc-50 border-zinc-200 rounded-xl focus-visible:ring-rose-500"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-zinc-200 text-zinc-600 hover:text-rose-500 hover:bg-rose-50"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mb-6 border-t border-dashed border-zinc-200 pt-6">
                <div className="flex justify-between text-zinc-600 text-sm">
                  <span>Tạm tính</span>
                  <span className="font-medium text-zinc-900">
                    {total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 text-sm">
                  <span>Phí vận chuyển</span>
                  {remainingForFreeShip <= 0 ? (
                    <span className="text-rose-500 font-medium">0₫</span>
                  ) : (
                    <span className="font-medium text-zinc-900">0₫</span>
                  )}
                </div>
                {/* Giả lập giảm giá */}
                <div className="flex justify-between text-zinc-600 text-sm">
                  <span>Giảm giá</span>
                  <span className="text-zinc-900">-0₫</span>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-500 font-medium">Tổng cộng</span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-zinc-900 tracking-tight">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                      Đã bao gồm VAT
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="w-full h-14 rounded-2xl bg-zinc-900 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all duration-300 text-base font-bold tracking-wide"
              >
                Tiến hành thanh toán
                <CreditCard className="ml-2 w-4 h-4" />
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">
                  Bảo mật thanh toán 100%
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
