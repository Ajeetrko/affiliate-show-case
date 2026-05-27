import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import type { Product } from '../types';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    productName: '',
    image: '',
    amazonLink: '',
    price: 0,
    shortDescription: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setError(null); // Clear error on change
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Duplicate check (Client side)
    const isDuplicate = products.some(p => 
      p.productName.toLowerCase() === formData.productName?.toLowerCase() && 
      p.category.toLowerCase() === formData.category?.toLowerCase() &&
      p._id !== isEditing
    );

    if (isDuplicate) {
      setError('A product with this name already exists in this category!');
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/products?id=${isEditing}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to save product');
      }

      setSuccess(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      setTimeout(() => setSuccess(null), 3000); // Auto hide after 3 seconds

      setIsEditing(null);
      setFormData({ productName: '', image: '', amazonLink: '', price: 0, shortDescription: '', category: '' });
      fetchProducts();
    } catch (err) {
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setSuccess('Product deleted successfully!');
          setTimeout(() => setSuccess(null), 3000);
          fetchProducts();
        }
      } catch (err) {
        setError('Failed to delete product.');
      }
    }
  };

  const handleEdit = (product: Product) => {
    if (product._id) {
      setIsEditing(product._id);
      setFormData({
        productName: product.productName,
        image: product.image,
        amazonLink: product.amazonLink,
        price: product.price,
        shortDescription: product.shortDescription,
        category: product.category
      });
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar darkMode={false} toggleDarkMode={() => {}} searchQuery="" setSearchQuery={() => {}} />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex justify-between items-center shadow-sm">
            <span>{error}</span>
            <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl flex justify-between items-center shadow-sm animate-pulse">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Add/Edit Form */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-12 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {isEditing ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Product Name</label>
              <input name="productName" value={formData.productName} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <input name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Image URL</label>
              <input name="image" value={formData.image} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Amazon Link</label>
              <input name="amazonLink" value={formData.amazonLink} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Price (INR)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Short Description</label>
              <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 h-24" required />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95">
                {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(null); setFormData({ productName: '', image: '', amazonLink: '', price: 0, shortDescription: '', category: '' }); }} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-300 transition-all">
                  <X className="h-4 w-4" /> Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Product List */}
        <section className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-10 w-10 object-cover rounded shadow-sm" />
                      <span className="font-medium line-clamp-1">{product.productName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => product._id && handleDelete(product._id)} 
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Admin;
