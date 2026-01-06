import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, LogOut as LogOutIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export const HomeHeader = () => {
  const { user, signOut } = useAuthStore();
  const { getCartItemsCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        navigate("/signin");
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đăng xuất");
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter uppercase border-2 border-black px-2 py-1"
          >
            ShopQuanAo
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/products"
              className="hidden md:block text-sm font-medium hover:underline underline-offset-4"
            >
              Sản phẩm
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/cart">
                <Button
                  variant="ghost"
                  className="relative group hover:bg-zinc-100 rounded-full"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {getCartItemsCount()}
                    </span>
                  )}
                  <span className="sr-only">Giỏ hàng</span>
                </Button>
              </Link>

              <Link to="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  Đơn hàng
                </Button>
              </Link>

              {user && user.role === "admin" && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    className="border-zinc-200 hover:bg-black hover:text-white transition-colors"
                  >
                    Admin
                  </Button>
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-2 pl-4 border-l border-zinc-200">
                  <span className="text-sm font-semibold hidden sm:block">
                    Hi, {user.displayName}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/signin">
                  <Button className="bg-black text-white hover:bg-zinc-800 rounded-none px-6">
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};
