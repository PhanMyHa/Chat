import { useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HomeFooter } from "@/components/home/HomeFooter";

const Home = () => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts({ isFeatured: true, limit: 8 });
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-black selection:text-white">
      <HomeHeader />
      <HeroSection />
      <FeaturedProducts products={products} />
      <FeaturesSection />
      <HomeFooter />
    </div>
  );
};

export default Home;
