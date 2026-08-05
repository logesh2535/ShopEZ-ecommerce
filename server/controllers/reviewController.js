import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Newsletter from '../models/Newsletter.js';

// @desc    Add review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      userId: req.user._id,
      productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      userId: req.user._id,
      productId,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Update product rating and reviewsCount
    const allReviews = await Review.find({ productId });
    product.reviewsCount = allReviews.length;
    const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Number((totalRating / allReviews.length).toFixed(1));

    await product.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email is already subscribed!' });
    }

    await Newsletter.create({ email: email.toLowerCase() });
    res.status(201).json({ message: 'Successfully subscribed to ShopEZ newsletter!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
