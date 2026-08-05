import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Category image URL is required'],
    },
    bannerImage: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    featuredImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
