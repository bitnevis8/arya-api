const express = require('express');
const ItemController = require('./controller');
const router = express.Router();

// روت‌های مربوط به آیتم
router.get('/getAll', ItemController.getAll); // دریافت تمام آیتم‌ها
router.get('/search', ItemController.search); // جستجوی آیتم‌ها
router.get('/getOne/:id', ItemController.getOne); // دریافت یک آیتم
router.post('/create', ItemController.create); // ایجاد آیتم جدید
router.put('/update/:id', ItemController.update); // ویرایش آیتم
router.delete('/delete/:id', ItemController.delete); // حذف آیتم

module.exports = router; 