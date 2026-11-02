"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import api from "@/lib/axios";
import { getLocalItem } from "@/lib/storage";

export default function ProductCatalogGrid({ initialProducts = [] }) {
  const [productsList, setProductsList] = useState(initialProducts);

  useEffect(() => {
    // 1. Check local storage overrides for instant client-side preview
    const local = getLocalItem("dezoryn_admin_products");
    if (Array.isArray(local) && local.length > 0) {
      setProductsList(local);
    }

    // 2. Fetch fresh products from live backend API
    api.get("/api/v1/products")
      .then((res) => {
        const list = res.data?.data || res.data?.products || (Array.isArray(res.data) ? res.data : null);
        if (Array.isArray(list) && list.length > 0) {
          setProductsList(list);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {productsList.map((p, idx) => (
        <Reveal key={p.slug} delay={idx * 0.04}>
          <ProductCard product={p} index={idx} compare={true} />
        </Reveal>
      ))}
    </div>
  );
}
