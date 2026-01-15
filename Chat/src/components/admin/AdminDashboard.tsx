
import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { TabNavigation } from "@/components/admin/TabNavigation";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { CustomersTab } from "@/components/admin/CustomersTab";

export type TabType = "products" | "categories" | "orders" | "customers";

export const AdminDashboard = () => {
  const { products, categories, fetchProducts, fetchCategories } =
    useProductStore();
  const [activeTab, setActiveTab] = useState<TabType>("products");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });


  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchCategories();
    fetchStats();
  }, [fetchProducts, fetchCategories]);

  const fetchStats = async () => {
    try {
      const [ordersRes, customersRes] = await Promise.all([
        orderService.getAllOrders({ limit: 1 }),
        userService.getAllUsers({ limit: 1 }),
      ]);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: ordersRes.pagination?.total || 0,
        totalCustomers: customersRes.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <StatsCards
          stats={stats}
          onOrdersClick={() => setActiveTab("orders")}
          onCustomersClick={() => setActiveTab("customers")}
        />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "products" && (
            <ProductsTab refreshStats={fetchStats} />
          )}
          {activeTab === "categories" && (
            <CategoriesTab refreshStats={fetchStats} />
          )}
          {activeTab === "orders" && <OrdersTab refreshStats={fetchStats} />}
          {activeTab === "customers" && <CustomersTab />}
        </div>
        
      </div>
    </div>
  );
};
