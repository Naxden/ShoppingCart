"use client";

import { Product } from "@/app/types/Product";
import { useState } from "react";
import { cartStore } from "@/app/stores/cartStore";

const ProductCard = (props: Product) => {
  const { id, title, price, description, images } = props;
  const [mainIndex, setMainIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const hasMultiple = images.length > 1;
  const prev = () => {
    if (!hasMultiple) return;
    setMainIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = () => {
    if (!hasMultiple) return;
    setMainIndex((i) => (i + 1) % images.length);
  };

  const handleAddToCart = () => {
    cartStore.addProduct(props);
  };

  return (
    <div className="border p-4">
      <h2 className="text-lg font-bold mb-2">{title}</h2>

      {images.length > 0 ? (
        <div className="mb-4 relative">
          <div className="mb-2">
            <img
              src={images[mainIndex]}
              alt={`${title} ${mainIndex + 1}`}
              className="w-full h-48 object-cover rounded"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-500">No images available</div>
      )}

      <p className="text-gray-700 mb-2">
        {expanded
          ? description
          : `${description.slice(0, 100)}${description.length > 100 ? "..." : ""}`}
        {description.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 ml-2"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <div className="flex items-center justify-between gap-4">
        <p className="text-blue-600 font-semibold">${price.toFixed(2)}</p>

        <button
          onClick={handleAddToCart}
          aria-label={`Add ${title} to cart`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
