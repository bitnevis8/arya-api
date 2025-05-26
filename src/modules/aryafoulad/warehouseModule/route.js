const express = require('express');
const router = express.Router();

// Import submodule routes
const warehouseRoutes = require('./warehouse/route');
const inventoryRoutes = require('./inventory/route');
const itemRoutes = require('./item/route');
const itemAssignmentRoutes = require('./itemAssignment/route');

// Use warehouse routes
router.use('/warehouse', warehouseRoutes);

// Use inventory routes
router.use('/inventory', inventoryRoutes);

// Use item routes
router.use('/item', itemRoutes);

// Use item assignment routes
router.use('/item-assignment', itemAssignmentRoutes);

module.exports = router; 