import Product from '../models/Product.js';

// @desc    Get all products with filtering, searching, sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      featured,
      deal,
      bestseller,
    } = req.query;

    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (deal === 'true') {
      query.isDeal = true;
    }

    if (bestseller === 'true') {
      query.isBestSeller = true;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'popularity') {
      sortOptions = { reviewsCount: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      brand,
      images,
      stock,
      specifications,
      isFeatured,
      isDeal,
      isBestSeller,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      category,
      brand: brand || 'ShopEZ',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      stock: stock !== undefined ? stock : 10,
      specifications: specifications || {},
      isFeatured: isFeatured || false,
      isDeal: isDeal || false,
      isBestSeller: isBestSeller || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.images = req.body.images || product.images;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.specifications = req.body.specifications || product.specifications;
      product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
      product.isDeal = req.body.isDeal !== undefined ? req.body.isDeal : product.isDeal;
      product.isBestSeller = req.body.isBestSeller !== undefined ? req.body.isBestSeller : product.isBestSeller;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
