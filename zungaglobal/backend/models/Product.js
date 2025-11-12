import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: String,
  brand: String,
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: String,
  trackQuantity: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  lowStockAlert: {
    type: Number,
    default: 5
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  seo: {
    title: String,
    description: String,
    slug: String
  },
  variants: [{
    name: String,
    options: [{
      value: String,
      price: Number,
      quantity: Number,
      sku: String
    }]
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    isApproved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update average rating when reviews are modified
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const approvedReviews = this.reviews.filter(review => review.isApproved);
    if (approvedReviews.length > 0) {
      this.averageRating = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
      this.reviewCount = approvedReviews.length;
    }
  }
  next();
});

// Generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

export default mongoose.model('Product', productSchema);