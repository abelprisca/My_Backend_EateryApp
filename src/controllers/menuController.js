import { z } from 'zod';
import { MenuItem } from '../models/MenuItem.js';
import { NotFoundError } from '../utils/errors.js';

// Validation Schemas
export const createMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().positive('Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    image: z.any().optional(),
    isDietary: z.string().optional().default(''),
  }),
});

export const updateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.coerce.number().positive().optional(),
    category: z.string().optional(),
    image: z.any().optional(),
    isDietary: z.string().optional(),
    isAvailable: z.coerce.boolean().optional(),
  }),
});

export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, dietary, sortBy } = req.query;

    const query = { isAvailable: true };

    if (category) {
      query.category = String(category);
    }

    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (dietary) {
      const targetTags = String(dietary)
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (targetTags.length > 0) {
        query.isDietary = { $all: targetTags };
      }
    }

    let menuQuery = MenuItem.find(query);

    if (sortBy === 'priceAsc') {
      menuQuery = menuQuery.sort({ price: 1 });
    } else if (sortBy === 'priceDesc') {
      menuQuery = menuQuery.sort({ price: -1 });
    }

    const items = await menuQuery;

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        menuItems: items,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    res.status(200).json({
      status: 'success',
      data: {
        menuItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, isDietary } = req.body;

const image = req.file
  ? `/uploads/${req.file.filename}`
  : null;

    const dietaryArray = isDietary
      ? isDietary.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      isDietary: dietaryArray,
    });

    res.status(201).json({
      status: 'success',
      data: {
        menuItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
  updateData.image = `/uploads/${req.file.filename}`;
}

    if (updateData.isDietary !== undefined) {
      updateData.isDietary = updateData.isDietary
        ? updateData.isDietary.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      throw new NotFoundError('Menu item not found');
    }

    res.status(200).json({
      status: 'success',
      data: {
        menuItem: updatedItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await MenuItem.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundError('Menu item not found');
    }

   res.status(200).json({
  status: 'success',
  message: 'Menu item deleted successfully.'
});
  } catch (error) {
    next(error);
  }
};
