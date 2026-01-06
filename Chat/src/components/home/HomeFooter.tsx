export const HomeFooter = () => {
  return (
    <footer className="bg-white border-t border-zinc-100 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-black tracking-tighter uppercase">
            ShopQuanAo
          </span>
          <p className="text-sm text-zinc-500 mt-2">
            &copy; 2026. Designed for elegance.
          </p>
        </div>

        <div className="flex gap-6">
          <a
            href="#"
            className="text-zinc-400 hover:text-black transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            className="text-zinc-400 hover:text-black transition-colors"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-zinc-400 hover:text-black transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};
