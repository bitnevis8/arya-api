const express = require('express');
const router = express.Router();
const warehouseRoutes = require('./warehouse/route');
const itemRoutes = require('./item/route');
const inventoryRoutes = require('./inventory/route');
const itemAssignmentRoutes = require('./itemAssignment/route');
const initWarehouseModule = require('./init');

// تعریف روابط بین مدل‌ها
initWarehouseModule();

// تعریف روت‌ها
router.use('/warehouses', warehouseRoutes);
router.use('/items', itemRoutes);
router.use('/inventories', inventoryRoutes);
router.use('/assignments', itemAssignmentRoutes);

module.exports = router; 