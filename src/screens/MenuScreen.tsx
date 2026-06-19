import { useMemo, useState } from "react";
import { Clock, Plus, QrCode, Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContextCard } from "../components/shell/ContextCard";
import { Logo } from "../components/shell/Logo";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { IconButton } from "../components/ui/IconButton";
import { ProductVisual } from "../components/ui/ProductVisual";
import { categories, products } from "../data/products";
import { cartItemCount, cartMaxPrepTime, formatCurrency } from "../lib/pricing";
import { useAppStore } from "../store/useAppStore";

type CategoryFilter = (typeof categories)[number] | "All";

export function MenuScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const cart = useAppStore((s) => s.cart);
  const addToCart = useAppStore((s) => s.addToCart);
  const pushToast = useAppStore((s) => s.pushToast);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory === "Premium Picks") {
      list = list.filter((p) => p.price >= 250);
    } else if (activeCategory === "Quick Pickup") {
      list = list.filter((p) => p.preparationMinutes <= 4);
    } else if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, query]);

  function quickAdd(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.available) return;
    const size = product.sizes?.[0];
    addToCart({
      productId: product.id,
      name: product.name,
      icon: product.icon,
      image: product.image,
      unitPrice: size ? size.price : product.price,
      quantity: 1,
      size: size?.name,
      flavour: product.flavours?.[0],
      estimatedPreparationMinutes: product.preparationMinutes,
    });
    pushToast("Added to cart", "success");
  }

  const itemCount = cartItemCount(cart);

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),20px)]">
        <IconButton aria-label="Search menu" onClick={() => setSearchOpen((v) => !v)}>
          <Search className="size-4" />
        </IconButton>
        <Logo size="sm" />
        <div className="flex gap-2">
          <IconButton aria-label="Scan QR" onClick={() => pushToast("QR scanning is decorative in this prototype")}>
            <QrCode className="size-4" />
          </IconButton>
          <IconButton aria-label="View cart" badge={itemCount} onClick={() => navigate("/cart")}>
            <ShoppingCart className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="px-5 pt-4">
        <h1 className="font-display text-[24px] font-bold text-ink">Allu Cinemas Menu</h1>
        <p className="text-[13px] text-text-secondary">Order ahead and pick up faster</p>
      </div>

      {searchOpen && (
        <div className="px-5 pt-3">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu"
            className="w-full rounded-input border border-border bg-surface px-4 py-3 text-[14px] text-ink outline-none focus-visible:border-gold-500"
          />
        </div>
      )}

      <div className="px-5 pt-4">
        <ContextCard />
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        <Chip active={activeCategory === "All"} onClick={() => setActiveCategory("All")}>
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Chip>
        ))}
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-[15px] font-bold text-ink">Recommended for your show</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-card bg-surface p-3 shadow-[var(--shadow-sm)]">
            <button
              type="button"
              onClick={() => navigate(`/product/${product.id}`)}
              className="block w-full text-left"
            >
              <ProductVisual
                image={product.image}
                icon={product.icon}
                className="mb-2 h-20 w-full rounded-xl"
                iconClassName="size-8 text-gold-300"
              />
              <p className="truncate text-[13px] font-bold text-ink">{product.name}</p>
              <p className="line-clamp-2 text-[11px] text-text-secondary">{product.description}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-text-tertiary">
                <Clock className="size-3" /> Ready in {product.preparationMinutes} mins
              </p>
            </button>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[14px] font-bold text-ink">{formatCurrency(product.price)}</span>
              {product.available ? (
                <button
                  type="button"
                  onClick={() => quickAdd(product.id)}
                  aria-label={`Add ${product.name} to cart`}
                  className="flex items-center gap-1 rounded-chip border border-navy-900 px-3 py-1.5 text-[12px] font-semibold text-navy-900 active:scale-95"
                >
                  <Plus className="size-3.5" /> Add
                </button>
              ) : (
                <span className="rounded-chip bg-disabled/30 px-3 py-1.5 text-[11px] font-semibold text-text-tertiary">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="col-span-2 py-10 text-center text-[13px] text-text-secondary">
            No items match your search.
          </p>
        )}
      </div>

      {cart.length > 0 && (
        <div className="sticky bottom-0 mt-4 px-5 pb-4">
          <div className="gradient-navy flex items-center justify-between rounded-card p-4 shadow-[var(--shadow-md)]">
            <div>
              <p className="text-[14px] font-bold text-ivory-50">
                {itemCount} {itemCount === 1 ? "item" : "items"} · {formatCurrency(cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0))}
              </p>
              <p className="text-[11px] text-ivory-50/70">Ready in approx. {cartMaxPrepTime(cart)} mins</p>
            </div>
            <Button variant="gold" fullWidth={false} className="px-5" onClick={() => navigate("/cart")}>
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
