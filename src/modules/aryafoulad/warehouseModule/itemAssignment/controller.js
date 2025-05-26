const BaseController = require('../../../../core/baseController');
const ItemAssignment = require('./model');
const Item = require('../item/model');
const User = require('../../../user/user/model');
const { Op } = require('sequelize');

class ItemAssignmentController extends BaseController {
    constructor() {
        super(ItemAssignment);
    }

    // دریافت تمام تخصیص‌های فعال
    async getActiveAssignments(req, res) {
        try {
            const assignments = await ItemAssignment.findAll({
                where: {
                    status: 'assigned'
                },
                include: [
                    {
                        model: Item,
                        as: 'item',
                        attributes: ['id', 'name', 'code', 'model']
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ],
                order: [['assignmentDate', 'DESC']]
            });

            return this.response(res, 200, true, "لیست تخصیص‌های فعال دریافت شد.", assignments);
        } catch (error) {
            console.error("❌ Error in getActiveAssignments:", error);
            return this.response(res, 500, false, "خطا در دریافت تخصیص‌های فعال", null, error);
        }
    }

    // دریافت تاریخچه تخصیص‌های یک آیتم
    async getItemHistory(req, res) {
        try {
            const { itemId } = req.params;
            
            const history = await ItemAssignment.findAll({
                where: { itemId },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }],
                order: [['createdAt', 'DESC']]
            });

            return this.response(res, 200, true, "تاریخچه تخصیص‌های آیتم دریافت شد.", history);
        } catch (error) {
            console.error("❌ Error in getItemHistory:", error);
            return this.response(res, 500, false, "خطا در دریافت تاریخچه تخصیص‌های آیتم", null, error);
        }
    }

    // دریافت تاریخچه تخصیص‌های یک کاربر
    async getUserHistory(req, res) {
        try {
            const { userId } = req.params;
            
            const history = await ItemAssignment.findAll({
                where: { userId },
                include: [{
                    model: Item,
                    as: 'item',
                    attributes: ['id', 'name', 'code', 'model']
                }],
                order: [['createdAt', 'DESC']]
            });

            return this.response(res, 200, true, "تاریخچه تخصیص‌های کاربر دریافت شد.", history);
        } catch (error) {
            console.error("❌ Error in getUserHistory:", error);
            return this.response(res, 500, false, "خطا در دریافت تاریخچه تخصیص‌های کاربر", null, error);
        }
    }

    // تخصیص آیتم به کاربر
    async assignItem(req, res) {
        try {
            const { itemId, userId, projectId, notes } = req.body;
            
            // بررسی وجود آیتم
            const item = await Item.findByPk(itemId);
            if (!item) {
                return this.response(res, 404, false, "آیتم یافت نشد");
            }

            // بررسی تخصیص قبلی
            const existingAssignment = await ItemAssignment.findOne({
                where: {
                    itemId,
                    status: 'assigned'
                }
            });

            if (existingAssignment) {
                return this.response(res, 400, false, "این آیتم قبلاً به کاربر دیگری تخصیص داده شده است");
            }

            // ایجاد تخصیص جدید
            const assignment = await ItemAssignment.create({
                itemId,
                userId,
                projectId,
                notes,
                status: 'assigned'
            });

            return this.response(res, 201, true, "تخصیص آیتم با موفقیت انجام شد.", assignment);
        } catch (error) {
            console.error("❌ Error in assignItem:", error);
            return this.response(res, 500, false, "خطا در تخصیص آیتم", null, error);
        }
    }

    // بازگشت آیتم
    async returnItem(req, res) {
        try {
            const { assignmentId } = req.params;
            
            const assignment = await ItemAssignment.findByPk(assignmentId);
            if (!assignment) {
                return this.response(res, 404, false, "تخصیص یافت نشد");
            }

            if (assignment.status !== 'assigned') {
                return this.response(res, 400, false, "این آیتم قبلاً برگشت داده شده است");
            }

            await assignment.update({
                status: 'returned',
                returnDate: new Date()
            });

            return this.response(res, 200, true, "آیتم با موفقیت برگشت داده شد.");
        } catch (error) {
            console.error("❌ Error in returnItem:", error);
            return this.response(res, 500, false, "خطا در بازگشت آیتم", null, error);
        }
    }

    // گزارش گم شدن آیتم
    async reportLost(req, res) {
        try {
            const { assignmentId } = req.params;
            const { notes } = req.body;
            
            const assignment = await ItemAssignment.findByPk(assignmentId);
            if (!assignment) {
                return this.response(res, 404, false, "تخصیص یافت نشد");
            }

            if (assignment.status !== 'assigned') {
                return this.response(res, 400, false, "این آیتم قبلاً برگشت داده شده است");
            }

            await assignment.update({
                status: 'lost',
                notes: notes || 'گزارش گم شدن آیتم'
            });

            return this.response(res, 200, true, "وضعیت آیتم به گم شده تغییر کرد.");
        } catch (error) {
            console.error("❌ Error in reportLost:", error);
            return this.response(res, 500, false, "خطا در گزارش گم شدن آیتم", null, error);
        }
    }
}

module.exports = new ItemAssignmentController(); 