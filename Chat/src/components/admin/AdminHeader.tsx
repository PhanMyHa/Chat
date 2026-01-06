import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, LogOut as LogOutIcon } from "lucide-react";
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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Trang chủ 
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Giỏ hàng
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Button>
            </Link>
            <span className="text-sm text-gray-600">{user?.displayName}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOutIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
