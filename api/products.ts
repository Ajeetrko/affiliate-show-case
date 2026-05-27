import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db.ts';
import Product from './models/Product.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`API Request: ${req.method} ${req.url}`);
  try {
    await dbConnect();
    console.log('Database connected successfully');
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ error: 'Database connection failed', details: dbError });
  }

  if (req.method === 'GET') {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 });
      console.log(`Fetched ${products.length} products`);
      return res.status(200).json(products);
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ error: 'Failed to fetch products', details: error });
    }
  }

  if (req.method === 'POST') {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to create product' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to delete product' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
