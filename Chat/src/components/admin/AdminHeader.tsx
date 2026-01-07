import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  ShoppingCart,
  LogOut as LogOutIcon,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export const AdminHeader = () => {
  const { user, signOut } = useAuthStore();
  const { getCartItemsCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Đăng xuất thành công!", {
        description: "Hẹn gặp lại bạn sớm.",
      });
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-6 h-16">
        <div className="flex h-full items-center justify-between">
          {/* --- Left: Logo Section --- */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin
              </span>
              <span className="text-gray-800">Dashboard</span>
            </h1>
          </div>

          {/* --- Right: Actions & Profile --- */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Navigation Group */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all text-gray-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all text-gray-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Giỏ hàng
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white animate-in zoom-in duration-300">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </nav>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            {/* User Profile Dropdown / Area */}
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-700 leading-none">
                  {user?.displayName || "Admin User"}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  Administrator
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200 text-blue-600">
                  <User className="w-5 h-5" />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOutIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
