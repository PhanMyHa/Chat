import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  LogOut as LogOutIcon,
  User,
  Package,
  Store,
  ShieldCheck,
} from "lucide-react";
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

  const cartCount = getCartItemsCount();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 h-16">
        <div className="flex h-full items-center justify-between">
 
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-zinc-900/20 transition-transform group-hover:scale-105">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-zinc-900 leading-none">
                Chat-Shop
              </span>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                Fashion Store
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200/50 absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white hover:text-black text-zinc-600 font-medium transition-all"
              >
                Trang chủ
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white hover:text-black text-zinc-600 font-medium transition-all"
              >
                Sản phẩm
              </Button>
            </Link>
            <Link to="/orders">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white hover:text-black text-zinc-600 font-medium transition-all"
              >
                Đơn hàng
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user && user.role === "admin" && (
              <Link to="/admin" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-zinc-200 text-xs font-semibold hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-zinc-100 text-zinc-700 transition-all group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-3 pl-1">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-semibold text-zinc-800 leading-none">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    Member
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-600">
                    <User className="w-5 h-5" />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOutIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/signin">
                <Button className="rounded-full bg-black text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 px-6 font-medium">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
