const express = require('express');
const missionOrderRoutes = require('./missionOrder/route');
const unitLocationRoutes = require('./unitLocation/route');
const rateSettingRoutes = require('./rateSettings/route');
const warehouseModuleRoutes = require('./warehouseModule/route');

const router = express.Router();

// Use mission order routes
router.use('/mission-orders', missionOrderRoutes);

// Use unit location routes
router.use('/unit-locations', unitLocationRoutes);

// Use rate settings routes
router.use('/rate-settings', rateSettingRoutes);

// Use warehouse module routes
router.use('/warehouse-module', warehouseModuleRoutes);

// Additional routes for other modules can be added here

module.exports = router; 