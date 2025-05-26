const express = require('express');
const router = express.Router();
const inventoryController = require('./controller');

// روت‌های اصلی موجودی
router.get('/getAll', inventoryController.getAll); // دریافت تمام موجودی‌ها
router.get('/search', inventoryController.search); // جستجوی موجودی‌ها
router.get('/getOne/:id', inventoryController.getOne); // دریافت یک موجودی
router.post('/create', inventoryController.create); // ایجاد موجودی جدید
router.put('/update/:id', inventoryController.update); // ویرایش موجودی
router.delete('/delete/:id', inventoryController.delete); // حذف موجودی

// روت‌های مدیریت موجودی
router.post('/addStock/:id', inventoryController.addStock); // افزایش موجودی
router.post('/reduceStock/:id', inventoryController.reduceStock); // کاهش موجودی
router.get('/getStockHistory/:id', inventoryController.getStockHistory); // دریافت تاریخچه تغییرات موجودی
router.get('/getLowStock', inventoryController.getLowStock); // دریافت موجودی‌های با حداقل موجودی
router.get('/getWarehouseInventory/:warehouseId', inventoryController.getWarehouseInventory); // دریافت موجودی‌های یک انبار

module.exports = router; 