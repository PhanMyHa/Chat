import { useState, useEffect } from "react";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/product";
import { toast } from "sonner";

interface CategoryFormProps {
  initialData: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryForm = ({
  initialData,
  onClose,
  onSuccess,
}: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        slug: initialData.slug,
      });
    } else {
      setFormData({ name: "", description: "", slug: "" });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await productService.updateCategory(initialData._id, formData);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await productService.createCategory(formData);
        toast.success("Tạo danh mục thành công");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Card className="p-6 mb-6 border-zinc-200 shadow-sm bg-zinc-50/50">
      <h3 className="font-bold mb-4">
        {initialData ? "Sửa danh mục" : "Thêm danh mục mới"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Tên danh mục *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mb-4 space-y-2">
          <Label>Mô tả</Label>
          <textarea
            className="w-full min-h-20 px-3 py-2 border rounded-md border-input bg-background text-sm"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">{initialData ? "Cập nhật" : "Tạo mới"}</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};
