import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [ "Appetizers", "Mains", "Sides", "Desserts", "Drinks", "Fast Food", "Rice Dishes", "Grilled Meals", "Soups", "Salads" ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDietary: {
      type: [String],
      default: [], // e.g. ["vegetarian", "gluten-free"]
    },
  },
  {
    timestamps: true,
  }
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
