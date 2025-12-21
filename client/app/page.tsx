'use client'

import { useEffect, useState } from 'react'
import {Product} from "@/app/types/Product";
import ProductCard from "@/app/components/ProductCard";
import {getProducts} from "@/app/lib/api";

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((p: Product) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
