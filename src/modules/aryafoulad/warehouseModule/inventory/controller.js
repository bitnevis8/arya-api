const BaseController = require('../../../../core/baseController');
const Inventory = require('./model');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

class InventoryController extends BaseController {
    constructor() {
        super(Inventory);
    }

    // دریافت تمام موجودی‌ها
    async getAll(req, res) {
        try {
            const inventories = await Inventory.findAll({
                include: ['warehouse', 'item']
            });
            return this.response(res, 200, true, "لیست موجودی‌ها دریافت شد.", inventories);
        } catch (error) {
            console.error("❌ Error in getAll:", error);
            return this.response(res, 500, false, "خطا در دریافت موجودی‌ها", null, error);
        }
    }

    // جستجوی موجودی‌ها
    async search(req, res) {
        try {
            const { query } = req.query;
            const inventories = await Inventory.findAll({
                where: {
                    [Op.or]: [
                        { '$item.name$': { [Op.like]: `%${query}%` } },
                        { '$item.code$': { [Op.like]: `%${query}%` } }
                    ]
                },
                include: ['warehouse', 'item']
            });
            return this.response(res, 200, true, "جستجو با موفقیت انجام شد.", inventories);
        } catch (error) {
            console.error("❌ Error in search:", error);
            return this.response(res, 500, false, "خطا در جستجوی موجودی‌ها", null, error);
        }
    }

    // دریافت یک موجودی
    async getOne(req, res) {
        try {
            const inventory = await Inventory.findByPk(req.params.id, {
                include: ['warehouse', 'item']
            });
            if (!inventory) {
                return this.response(res, 404, false, "موجودی یافت نشد.");
            }
            return this.response(res, 200, true, "موجودی دریافت شد.", inventory);
        } catch (error) {
            console.error("❌ Error in getOne:", error);
            return this.response(res, 500, false, "خطا در دریافت موجودی", null, error);
        }
    }

    // ایجاد موجودی جدید
    async create(req, res) {
        try {
            const { warehouseId, itemId, quantity, minQuantity, maxQuantity } = req.body;
            
            // بررسی تکراری نبودن آیتم در انبار
            const existingInventory = await Inventory.findOne({
                where: {
                    warehouseId,
                    itemId
                }
            });

            if (existingInventory) {
                return this.response(res, 400, false, "این آیتم قبلاً در این انبار ثبت شده است.");
            }

            const inventory = await Inventory.create({
                warehouseId,
                itemId,
                quantity,
                minQuantity,
                maxQuantity
            });

            return this.response(res, 201, true, "موجودی جدید ایجاد شد.", inventory);
        } catch (error) {
            console.error("❌ Error in create:", error);
            return this.response(res, 500, false, "خطا در ایجاد موجودی", null, error);
        }
    }

    // ویرایش موجودی
    async update(req, res) {
        try {
            const inventory = await Inventory.findByPk(req.params.id);
            if (!inventory) {
                return this.response(res, 404, false, "موجودی یافت نشد.");
            }

            const { quantity, minQuantity, maxQuantity } = req.body;
            await inventory.update({
                quantity: quantity ?? inventory.quantity,
                minQuantity: minQuantity ?? inventory.minQuantity,
                maxQuantity: maxQuantity ?? inventory.maxQuantity
            });

            return this.response(res, 200, true, "موجودی بروزرسانی شد.", inventory);
        } catch (error) {
            console.error("❌ Error in update:", error);
            return this.response(res, 500, false, "خطا در بروزرسانی موجودی", null, error);
        }
    }

    // حذف موجودی
    async delete(req, res) {
        try {
            const inventory = await Inventory.findByPk(req.params.id);
            if (!inventory) {
                return this.response(res, 404, false, "موجودی یافت نشد.");
            }

            await inventory.destroy();
            return this.response(res, 200, true, "موجودی حذف شد.");
        } catch (error) {
            console.error("❌ Error in delete:", error);
            return this.response(res, 500, false, "خطا در حذف موجودی", null, error);
        }
    }

    // افزایش موجودی
    async addStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity, notes } = req.body;

            const inventory = await Inventory.findByPk(id);
            if (!inventory) {
                return this.response(res, 404, false, "موجودی یافت نشد.");
            }

            const newQuantity = inventory.quantity + quantity;
            await inventory.update({
                quantity: newQuantity
            });

            // ثبت تاریخچه تغییرات
            await inventory.createStockHistory({
                type: 'add',
                quantity,
                previousQuantity: inventory.quantity,
                newQuantity,
                notes
            });

            return this.response(res, 200, true, "موجودی افزایش یافت.", inventory);
        } catch (error) {
            console.error("❌ Error in addStock:", error);
            return this.response(res, 500, false, "خطا در افزایش موجودی", null, error);
        }
    }

    // کاهش موجودی
    async reduceStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity, notes } = req.body;

            const inventory = await Inventory.findByPk(id);
            if (!inventory) {
                return this.response(res, 404, false, "موجودی یافت نشد.");
            }

            if (inventory.quantity < quantity) {
                return this.response(res, 400, false, "موجودی کافی نیست.");
            }

            const newQuantity = inventory.quantity - quantity;
            await inventory.update({
                quantity: newQuantity
            });

            // ثبت تاریخچه تغییرات
            await inventory.createStockHistory({
                type: 'reduce',
                quantity,
                previousQuantity: inventory.quantity,
                newQuantity,
                notes
            });

            return this.response(res, 200, true, "موجودی کاهش یافت.", inventory);
        } catch (error) {
            console.error("❌ Error in reduceStock:", error);
            return this.response(res, 500, false, "خطا در کاهش موجودی", null, error);
        }
    }

    // دریافت تاریخچه تغییرات موجودی
    async getStockHistory(req, res) {
        try {
            const { id } = req.params;
            const inventory = await Inventory.findByPk(id, {
                include: [{
                    model: require('./stockHistory/model'),
                    as: 'stockHistory',
                    order: [['createdAt', 'DESC']]
                }]
            });

            if (!inventory) {
                return this.response(res, 404, false, "موجودی یافت نشد.");
            }

            return this.response(res, 200, true, "تاریخچه تغییرات موجودی دریافت شد.", inventory.stockHistory);
        } catch (error) {
            console.error("❌ Error in getStockHistory:", error);
            return this.response(res, 500, false, "خطا در دریافت تاریخچه تغییرات", null, error);
        }
    }

    // دریافت موجودی‌های با حداقل موجودی
    async getLowStock(req, res) {
        try {
            const inventories = await Inventory.findAll({
                where: {
                    quantity: {
                        [Op.lte]: sequelize.col('minQuantity')
                    }
                },
                include: ['warehouse', 'item']
            });

            return this.response(res, 200, true, "موجودی‌های با حداقل موجودی دریافت شد.", inventories);
        } catch (error) {
            console.error("❌ Error in getLowStock:", error);
            return this.response(res, 500, false, "خطا در دریافت موجودی‌های با حداقل موجودی", null, error);
        }
    }

    // دریافت موجودی‌های یک انبار
    async getWarehouseInventory(req, res) {
        try {
            const { warehouseId } = req.params;
            const inventories = await Inventory.findAll({
                where: { warehouseId },
                include: ['item']
            });

            return this.response(res, 200, true, "موجودی‌های انبار دریافت شد.", inventories);
        } catch (error) {
            console.error("❌ Error in getWarehouseInventory:", error);
            return this.response(res, 500, false, "خطا در دریافت موجودی‌های انبار", null, error);
        }
    }
}

module.exports = new InventoryController(); 