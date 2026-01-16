import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "@/stores/useProductStore";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HomeHeader } from "@/components/home/HomeHeader";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProduct, isLoading, fetchProductById } = useProductStore();
  const { addToCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.sizes.length > 0) {
        setSelectedSize(selectedProduct.sizes[0].size);
      }
      if (selectedProduct.colors.length > 0) {
        setSelectedColor(selectedProduct.colors[0]);
      }
    }
  }, [selectedProduct]);

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;

    await addToCart({
      productId: selectedProduct._id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">Không tìm thấy sản phẩm</div>
    );
  }

  const displayPrice = selectedProduct.discountPrice || selectedProduct.price;
  const hasDiscount =
    selectedProduct.discountPrice &&
    selectedProduct.discountPrice < selectedProduct.price;
  const maxStock =
    selectedProduct.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <HomeHeader/>
      <Button
        variant="ghost"
        onClick={() => navigate("/products")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2" />
        Quay lại
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={selectedProduct.images[selectedImage] || "/placeholder.jpg"}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {selectedProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={image}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{selectedProduct.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-red-600">
              {displayPrice.toLocaleString("vi-VN")}₫
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {selectedProduct.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                  -
                  {Math.round(
                    ((selectedProduct.price - displayPrice) /
                      selectedProduct.price) *
                      100
                  )}
                  %
                </span>
              </>
            )}
          </div>

          <div className="text-gray-600 mb-2">
            Đã bán: {selectedProduct.totalSold}
          </div>

          <Card className="p-6 mb-6">
            {/* Size Selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Chọn size:</label>
              <div className="flex gap-2">
                {selectedProduct.sizes.map((sizeInfo) => (
                  <Button
                    key={sizeInfo.size}
                    variant={
                      selectedSize === sizeInfo.size ? "default" : "outline"
                    }
                    onClick={() => setSelectedSize(sizeInfo.size)}
                    disabled={sizeInfo.stock === 0}
                  >
                    {sizeInfo.size}
                    {sizeInfo.stock === 0 && " (Hết)"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {selectedProduct.colors.length > 0 && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">Chọn màu:</label>
                <div className="flex gap-2">
                  {selectedProduct.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Số lượng:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-16 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  disabled={quantity >= maxStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {maxStock} sản phẩm có sẵn
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              disabled={maxStock === 0}
            >
              <ShoppingCart className="mr-2" />
              Thêm vào giỏ hàng
            </Button>
          </Card>

          {/* Description */}
          <div>
            <h2 className="font-bold text-xl mb-3">Mô tả sản phẩm</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedProduct.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
