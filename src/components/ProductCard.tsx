import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ImageOff } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600" />
        )}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <ImageOff className="h-12 w-12 mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.productName}
            className={`w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-semibold text-primary-600 dark:text-primary-400 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col h-[200px]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.productName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <a
            href={product.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            Buy Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
