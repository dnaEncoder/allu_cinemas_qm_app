import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/shell/Header";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { ProductVisual } from "../components/ui/ProductVisual";
import { products } from "../data/products";
import { formatCurrency } from "../lib/pricing";
import { useAppStore } from "../store/useAppStore";

export function ProductDetailsScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const favouriteProductIds = useAppStore((s) => s.favouriteProductIds);
  const toggleFavourite = useAppStore((s) => s.toggleFavourite);
  const addToCart = useAppStore((s) => s.addToCart);
  const pushToast = useAppStore((s) => s.pushToast);

  const [size, setSize] = useState(product?.sizes?.[0]?.name);
  const [flavour, setFlavour] = useState(product?.flavours?.[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const basePrice = useMemo(() => {
    if (!product) return 0;
    const sizeOption = product.sizes?.find((s) => s.name === size);
    return sizeOption ? sizeOption.price : product.price;
  }, [product, size]);

  const addOnsTotal = useMemo(() => {
    if (!product?.addOns) return 0;
    return product.addOns
      .filter((a) => selectedAddOns.includes(a.name))
      .reduce((sum, a) => sum + a.price, 0);
  }, [product, selectedAddOns]);

  const unitPrice = basePrice + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  if (!product) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Product" />
        <p className="px-5 py-10 text-center text-[13px] text-text-secondary">Product not found.</p>
      </div>
    );
  }

  const isFavourite = favouriteProductIds.includes(product.id);

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      icon: product.icon,
      image: product.image,
      unitPrice,
      quantity,
      size,
      flavour,
      addOns: selectedAddOns,
      estimatedPreparationMinutes: product.preparationMinutes,
    });
    pushToast("Added to cart", "success");
    navigate("/menu");
  };

  return (
    <div className="relative flex h-full flex-col">
      <Header
        showLogo
        right={
          <button
            type="button"
            onClick={() => toggleFavourite(product.id)}
            aria-pressed={isFavourite}
            aria-label="Toggle favourite"
            className="flex size-10 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-sm)]"
          >
            <Heart className={`size-4 ${isFavourite ? "fill-danger text-danger" : "text-navy-900"}`} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <ProductVisual
          image={product.image}
          icon={product.icon}
          className="h-44 w-full rounded-hero"
          iconClassName="size-16 text-gold-300"
        />

        <h1 className="font-display mt-4 text-[22px] font-bold text-ink">{product.name}</h1>
        <p className="mt-1 text-[13px] text-text-secondary">{product.description}</p>
        <p className="mt-1 text-[12px] text-text-tertiary">Ready in {product.preparationMinutes} mins</p>
        <p className="mt-2 text-[20px] font-bold text-gold-600">{formatCurrency(basePrice)}</p>

        {product.sizes && (
          <section className="mt-5">
            <h2 className="mb-2 text-[14px] font-bold text-ink">Size</h2>
            <div className="flex gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setSize(option.name)}
                  className={`flex-1 rounded-card border-2 px-3 py-3 text-left transition ${
                    size === option.name ? "border-gold-500 bg-surface" : "border-border bg-surface"
                  }`}
                >
                  <p className="text-[13px] font-semibold text-ink">{option.name}</p>
                  <p className="text-[12px] text-text-secondary">{formatCurrency(option.price)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {product.flavours && (
          <section className="mt-5">
            <h2 className="mb-2 text-[14px] font-bold text-ink">Flavour</h2>
            <div className="flex flex-wrap gap-2">
              {product.flavours.map((option) => (
                <Chip key={option} active={flavour === option} onClick={() => setFlavour(option)}>
                  {option}
                </Chip>
              ))}
            </div>
          </section>
        )}

        {product.addOns && (
          <section className="mt-5">
            <h2 className="mb-2 text-[14px] font-bold text-ink">Add-ons</h2>
            <div className="flex flex-col gap-2">
              {product.addOns.map((addOn) => {
                const checked = selectedAddOns.includes(addOn.name);
                return (
                  <button
                    key={addOn.name}
                    type="button"
                    onClick={() => toggleAddOn(addOn.name)}
                    className="flex items-center justify-between rounded-card bg-surface px-4 py-3 shadow-[var(--shadow-sm)]"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex size-5 items-center justify-center rounded-md border-2 ${
                          checked ? "border-gold-500 bg-gold-500" : "border-border"
                        }`}
                      >
                        {checked && <span className="size-2 rounded-sm bg-navy-950" />}
                      </span>
                      <span className="text-[13px] font-medium text-ink">{addOn.name}</span>
                    </span>
                    <span className="text-[13px] font-semibold text-text-secondary">
                      +{formatCurrency(addOn.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-6 flex items-center justify-center">
          <QuantityStepper
            quantity={quantity}
            onIncrease={() => setQuantity((q) => q + 1)}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          />
        </section>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-surface/95 px-5 py-4 backdrop-blur">
        <Button
          disabled={!product.available}
          onClick={handleAddToCart}
        >
          {product.available ? `Add to Cart · ${formatCurrency(totalPrice)}` : "Currently unavailable"}
        </Button>
      </div>
    </div>
  );
}
