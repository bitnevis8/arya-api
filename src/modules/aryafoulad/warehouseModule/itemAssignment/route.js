const express = require('express');
const ItemAssignmentController = require('./controller');
const router = express.Router();

// روت‌های مربوط به تخصیص آیتم
router.get('/getActive', ItemAssignmentController.getActiveAssignments); // دریافت تمام تخصیص‌های فعال
router.get('/getItemHistory/:itemId', ItemAssignmentController.getItemHistory); // دریافت تاریخچه تخصیص‌های یک آیتم
router.get('/getUserHistory/:userId', ItemAssignmentController.getUserHistory); // دریافت تاریخچه تخصیص‌های یک کاربر

// عملیات تخصیص
router.post('/assign', ItemAssignmentController.assignItem); // تخصیص آیتم به کاربر
router.put('/return/:assignmentId', ItemAssignmentController.returnItem); // بازگشت آیتم
router.put('/reportLost/:assignmentId', ItemAssignmentController.reportLost); // گزارش گم شدن آیتم

module.exports = router; 