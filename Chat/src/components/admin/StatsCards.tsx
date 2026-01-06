import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, ClipboardList, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalCustomers: number;
  };
  onOrdersClick: () => void;
  onCustomersClick: () => void;
}

export const StatsCards = ({
  stats,
  onOrdersClick,
  onCustomersClick,
}: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Sản phẩm</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <div className="text-sm text-gray-600">Danh mục</div>
          </div>
        </div>
      </Card>

      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onOrdersClick}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Đơn hàng</div>
          </div>
        </div>
      </Card>

      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onCustomersClick}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="text-sm text-gray-600">Khách hàng</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
