import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";

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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button asChild>
            <Link to="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/products")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2" />
        Tiếp tục mua sắm
      </Button>

      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateCartItem}
                onRemove={removeFromCart}
              />
            ))}
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-red-600">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full"
              size="lg"
            >
              Tiến hành thanh toán
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
