import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  productCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from name
categorySchema.pre('save', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Update product count
categorySchema.statics.updateProductCount = async function(categoryId) {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ category: categoryId, isPublished: true });
  await this.findByIdAndUpdate(categoryId, { productCount: count });
};

export default mongoose.model('Category', categorySchema);