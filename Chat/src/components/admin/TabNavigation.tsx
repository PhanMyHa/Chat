type TabType = "products" | "categories" | "orders" | "customers";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  const tabs: { value: TabType; label: string }[] = [
    { value: "products", label: "Sản phẩm" },
    { value: "categories", label: "Danh mục" },
    { value: "orders", label: "Đơn hàng" },
    { value: "customers", label: "Khách hàng" },
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === tab.value
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
          
        ))}
      </div>
    </div>
  );
};
