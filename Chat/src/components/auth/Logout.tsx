import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { LogOut as LogOutIcon } from "lucide-react";
import { toast } from "sonner";

const Logout = () => {
  const { signOut } = useAuthStore();
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
    <Button onClick={handleLogout} variant="ghost" size="icon">
      <LogOutIcon className="w-4 h-4" />
    </Button>
  );
};

export default Logout;
