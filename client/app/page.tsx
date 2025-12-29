"use client";

import { getProducts } from "@/app/lib/api";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types/Product";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => <ProductCard key={product.id} {...product} />)
      )}
    </div>
  );
}
