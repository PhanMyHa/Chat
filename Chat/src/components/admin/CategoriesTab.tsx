import { useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryForm } from "../admin/CategoryForm";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/product";

export const CategoriesTab = ({
  refreshStats,
}: {
  refreshStats: () => void;
}) => {
  const { categories, fetchCategories } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await productService.deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
      refreshStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCategory(null);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Đóng form" : "Thêm danh mục"}
        </Button>
      </div>

      {showForm && (
        <CategoryForm
          initialData={editingCategory}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchCategories();
            refreshStats();
            setShowForm(false);
          }}
        />
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category._id}
            className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <h3 className="font-bold text-lg mb-1">{category.name}</h3>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 mb-2 inline-block">
                {category.slug}
              </code>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {category.description}
              </p>
            </div>
            <div className="flex gap-2 border-t pt-4">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingCategory(category);
                  setShowForm(true);
                }}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(category._id)}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Xóa
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
