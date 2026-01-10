import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type  { Product } from "@/types/product";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  initialData: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductForm = ({
  initialData,
  onClose,
  onSuccess,
}: ProductFormProps) => {
  const { categories } = useProductStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    sizes: [{ size: "S", stock: 0 }],
    colors: [""],
    images: [""],
    isFeatured: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        discountPrice: initialData.discountPrice?.toString() || "",
        category:
          typeof initialData.category === "string"
            ? initialData.category
            : initialData.category._id,
        sizes: initialData.sizes,
        colors: initialData.colors,
        images: initialData.images,
        isFeatured: initialData.isFeatured,
      });
    }
  }, [initialData]);

  // --- Helpers for Dynamic Fields ---
  const addSize = () =>
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", stock: 0 }],
    });
  const updateSize = (index: number, field: string, value: any) => {
    const newSizes = [...formData.sizes];
    // @ts-ignore
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };
  const removeSize = (index: number) =>
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });

  const addColor = () =>
    setFormData({ ...formData, colors: [...formData.colors, ""] });
  const updateColor = (index: number, value: string) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({ ...formData, colors: newColors });
  };
  const removeColor = (index: number) =>
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });

  const addImage = () =>
    setFormData({ ...formData, images: [...formData.images, ""] });
  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };
  const removeImage = (index: number) =>
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
      };

      if (initialData) {
        await productService.updateProduct(initialData._id, data);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.createProduct(data);
        toast.success("Tạo sản phẩm thành công");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Card className="p-6 mb-4 border-zinc-200 shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-lg font-bold">
          {initialData ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tên sản phẩm *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Danh mục *</Label>
            <select
              required
              className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background text-sm"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mô tả *</Label>
          <textarea
            required
            className="w-full min-h-25 px-3 py-2 border rounded-md border-input bg-background text-sm"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Giá gốc (VNĐ) *</Label>
            <Input
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Giá khuyến mãi (VNĐ)</Label>
            <Input
              type="number"
              value={formData.discountPrice}
              onChange={(e) =>
                setFormData({ ...formData, discountPrice: e.target.value })
              }
            />
          </div>
        </div>

        {/* Sizes Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-bold">Kích thước & Tồn kho</Label>
            <Button type="button" size="sm" variant="outline" onClick={addSize}>
              <Plus className="w-3 h-3 mr-1" /> Thêm Size
            </Button>
          </div>
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Size (S, M...)"
                value={size.size}
                onChange={(e) => updateSize(index, "size", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Số lượng"
                value={size.stock}
                onChange={(e) =>
                  updateSize(index, "stock", Number(e.target.value))
                }
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeSize(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Images Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-bold">Hình ảnh (URL)</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addImage}
            >
              <Plus className="w-3 h-3 mr-1" /> Thêm Ảnh
            </Button>
          </div>
          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Colors Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-bold">Màu sắc</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addColor}
            >
              <Plus className="w-3 h-3 mr-1" /> Thêm Màu
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-1">
                <Input
                  placeholder="Tên màu"
                  className="w-32"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeColor(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isFeatured"
            type="checkbox"
            className="w-4 h-4"
            checked={formData.isFeatured}
            onChange={(e) =>
              setFormData({ ...formData, isFeatured: e.target.checked })
            }
          />
          <Label htmlFor="isFeatured">Đánh dấu là sản phẩm nổi bật</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" className="w-32 bg-zinc-900">
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
        </div>
      </form>
    </Card>
  );
};
