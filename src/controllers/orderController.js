import { z } from "zod";
import { MenuItem } from "../models/MenuItem.js";
import { Order } from "../models/Order.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors.js";

// ======================================================
// VALIDATION SCHEMAS
// ======================================================

export const createOrderSchema = z.object({
  body: z.object({
    deliveryAddress: z
      .string()
      .min(5, "Delivery address must be at least 5 characters long")
      .optional(),

    items: z
      .array(
        z.object({
          menuItemId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid menu item ID"),

          quantity: z
            .number()
            .int()
            .positive("Quantity must be at least 1"),
        })
      )
      .min(1, "Order must contain at least one item"),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "PENDING",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ]),
  }),
});

// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, items } = req.body;
    const userId = req.user._id;

    const finalAddress = deliveryAddress || req.user.address;

    if (!finalAddress) {
      throw new BadRequestError("Delivery address is required.");
    }

    const itemIds = items.map((item) => item.menuItemId);

    const dbMenuItems = await MenuItem.find({
      _id: { $in: itemIds },
    });

    if (dbMenuItems.length !== itemIds.length) {
      throw new BadRequestError(
        "One or more menu items do not exist."
      );
    }

    const menuMap = new Map(
      dbMenuItems.map((item) => [item._id.toString(), item])
    );

    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const menu = menuMap.get(item.menuItemId);

      if (!menu.isAvailable) {
        throw new BadRequestError(
          `"${menu.name}" is currently unavailable.`
        );
      }

      totalAmount += menu.price * item.quantity;

      return {
        menuItem: item.menuItemId,
        quantity: item.quantity,
        price: menu.price,
      };
    });

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: finalAddress,
      status: "PENDING",
    });

    const populatedOrder = await order.populate([
      {
        path: "user",
        select: "fullName name email phone address role",
      },
      {
        path: "items.menuItem",
        select: "name image category price isAvailable",
      },
    ]);

    res.status(201).json({
      status: "success",
      data: {
        order: populatedOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// MY ORDERS
// ======================================================

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate({
        path: "items.menuItem",
        select: "name image category price",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
};
// ======================================================
// GET SINGLE ORDER
// ======================================================

export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({
        path: "user",
        select: "fullName name email phone address role",
      })
      .populate({
        path: "items.menuItem",
        select: "name image price category isAvailable",
      });

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      throw new ForbiddenError(
        "You do not have permission to view this order."
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// CANCEL ORDER
// ======================================================

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      throw new ForbiddenError(
        "You do not have permission to cancel this order."
      );
    }

    if (
      order.status !== "PENDING" &&
      req.user.role !== "ADMIN"
    ) {
      throw new BadRequestError(
        "This order has already been processed and cannot be cancelled."
      );
    }

    order.status = "CANCELLED";

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate({
        path: "user",
        select: "fullName name email phone address role",
      })
      .populate({
        path: "items.menuItem",
        select: "name image price category isAvailable",
      });

    res.status(200).json({
      status: "success",
      data: {
        order: updatedOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "fullName name email phone address role",
      })
      .populate({
        path: "items.menuItem",
        select: "name image category price isAvailable",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "user",
        select: "fullName name email phone address role",
      })
      .populate({
        path: "items.menuItem",
        select: "name image category price isAvailable",
      });

    if (!updatedOrder) {
      throw new NotFoundError("Order not found.");
    }

    res.status(200).json({
      status: "success",
      data: {
        order: updatedOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};