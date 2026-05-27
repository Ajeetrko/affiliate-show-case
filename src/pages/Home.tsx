import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar.tsx';
import ProductCard from '../components/ProductCard.tsx';
import SkeletonCard from '../components/SkeletonCard.tsx';
import FilterBar from '../components/FilterBar.tsx';
import productsData from '../data/products.json';
import { Sparkles } from 'lucide-react';
import type { Product } from '../types.ts';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(productsData);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const categories = useMemo(() => {
    const cats = productsData.map((p) => p.category);
    return Array.from(new Set(cats));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const topPicks = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
            Curated <span className="text-primary-600">Product</span> Picks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the best deals and top-rated products across electronics, home, and more. Hand-picked just for you.
          </p>
        </section>

        {/* Top Picks Section */}
        {!loading && searchQuery === '' && activeCategory === 'All' && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold">Top Picks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topPicks.map((product) => (
                <ProductCard key={`top-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Grid */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold">All Products</h2>
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-gray-500">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="mt-4 text-primary-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © 2026 AffiliateShowcase. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            As an Amazon Associate I earn from qualifying purchases.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
