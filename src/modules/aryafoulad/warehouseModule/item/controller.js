const BaseController = require('../../../../core/baseController');
const Item = require('./model');
const { Op } = require('sequelize');

class ItemController extends BaseController {
    constructor() {
        super(Item);
    }

    // ✅ دریافت تمام آیتم‌ها
    async getAll(req, res) {
        try {
            console.log("Starting getAll method...");
            const items = await Item.findAll();
            console.log("✅ Items found successfully");
            return this.response(res, 200, true, "لیست آیتم‌ها دریافت شد.", items);
        } catch (error) {
            console.error("❌ Error in getAll:", error);
            return this.response(
                res,
                500,
                false,
                error.message || "خطا در دریافت داده‌ها",
                null,
                error
            );
        }
    }

    // ✅ دریافت یک آیتم بر اساس ID
    async getOne(req, res) {
        try {
            const item = await Item.findByPk(req.params.id);
            
            if (!item) {
                console.warn("⚠️ Item not found:", req.params.id);
                return this.response(res, 404, false, "آیتم یافت نشد.");
            }

            console.log("✅ Item retrieved successfully:", req.params.id);
            return this.response(res, 200, true, "آیتم دریافت شد.", item);
        } catch (error) {
            console.error("❌ Error in getOne:", error);
            return this.response(res, 500, false, "خطا در دریافت داده", null, error);
        }
    }

    // ✅ ایجاد یک آیتم جدید
    async create(req, res) {
        try {
            const {
                name,
                model,
                serial_number,
                equipment_code,
                ownership,
                location,
                calibration_certificate,
                calibration_period_years,
                calibration_place,
                has_identity_document,
                code,
                description,
                unit,
                category,
                minQuantity,
                maxQuantity
            } = req.body;

            // چک کردن تکراری بودن نام، کد و کد تجهیز
            const existingItem = await Item.findOne({
                where: {
                    [Op.or]: [
                        { name },
                        { code },
                        { equipment_code }
                    ]
                }
            });

            if (existingItem) {
                console.warn("⚠️ Duplicate item attempt:", name, code, equipment_code);
                return this.response(
                    res,
                    400,
                    false,
                    "نام، کد یا کد تجهیز قبلاً ثبت شده است."
                );
            }

            // ایجاد آیتم جدید
            const newItem = await Item.create({
                name,
                model,
                serial_number,
                equipment_code,
                ownership,
                location,
                calibration_certificate,
                calibration_period_years,
                calibration_place,
                has_identity_document,
                code,
                description: description || null,
                unit,
                category: category || null,
                minQuantity: minQuantity || 0,
                maxQuantity: maxQuantity || 0
            });

            console.log("✅ Item created successfully:", newItem.id);
            return this.response(res, 201, true, "آیتم جدید ایجاد شد.", newItem);
        } catch (error) {
            console.error("❌ Error in create:", error);
            return this.response(res, 500, false, "خطا در ایجاد آیتم", null, error);
        }
    }

    // ✅ ویرایش یک آیتم
    async update(req, res) {
        try {
            const item = await Item.findByPk(req.params.id);
            if (!item) {
                console.warn("⚠️ Item not found for update:", req.params.id);
                return this.response(res, 404, false, "آیتم یافت نشد.");
            }

            const {
                name,
                model,
                serial_number,
                equipment_code,
                ownership,
                location,
                calibration_certificate,
                calibration_period_years,
                calibration_place,
                has_identity_document,
                code,
                description,
                unit,
                category,
                minQuantity,
                maxQuantity
            } = req.body;

            // چک کردن تکراری بودن نام، کد و کد تجهیز (اگر تغییر کرده باشند)
            if ((name && name !== item.name) || 
                (code && code !== item.code) || 
                (equipment_code && equipment_code !== item.equipment_code)) {
                const existingItem = await Item.findOne({
                    where: {
                        [Op.or]: [
                            { name: name || item.name },
                            { code: code || item.code },
                            { equipment_code: equipment_code || item.equipment_code }
                        ],
                        id: { [Op.ne]: item.id }
                    }
                });

                if (existingItem) {
                    console.warn("⚠️ Duplicate item name, code or equipment_code:", name, code, equipment_code);
                    return this.response(
                        res,
                        400,
                        false,
                        "نام، کد یا کد تجهیز قبلاً ثبت شده است."
                    );
                }
            }

            // بروزرسانی اطلاعات آیتم
            const updates = {
                name: name ?? item.name,
                model: model ?? item.model,
                serial_number: serial_number ?? item.serial_number,
                equipment_code: equipment_code ?? item.equipment_code,
                ownership: ownership ?? item.ownership,
                location: location ?? item.location,
                calibration_certificate: calibration_certificate ?? item.calibration_certificate,
                calibration_period_years: calibration_period_years ?? item.calibration_period_years,
                calibration_place: calibration_place ?? item.calibration_place,
                has_identity_document: has_identity_document ?? item.has_identity_document,
                code: code ?? item.code,
                description: description ?? item.description,
                unit: unit ?? item.unit,
                category: category ?? item.category,
                minQuantity: minQuantity ?? item.minQuantity,
                maxQuantity: maxQuantity ?? item.maxQuantity
            };

            await item.update(updates);

            console.log("✅ Item updated successfully:", item.id);
            return this.response(res, 200, true, "آیتم بروزرسانی شد.", item);
        } catch (error) {
            console.error("❌ Error in update:", error);
            return this.response(
                res,
                500,
                false,
                "خطا در بروزرسانی آیتم",
                null,
                error
            );
        }
    }

    // ✅ حذف یک آیتم
    async delete(req, res) {
        try {
            const item = await Item.findByPk(req.params.id);
            if (!item) {
                console.warn("⚠️ Item not found for deletion:", req.params.id);
                return this.response(res, 404, false, "آیتم یافت نشد.");
            }

            await item.destroy();
            console.log("✅ Item deleted successfully:", req.params.id);
            return this.response(res, 200, true, "آیتم حذف شد.");
        } catch (error) {
            console.error("❌ Error in delete:", error);
            return this.response(res, 500, false, "خطا در حذف آیتم", null, error);
        }
    }

    // ✅ جستجوی آیتم‌ها
    async search(req, res) {
        try {
            const { query } = req.query;
            const items = await Item.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { code: { [Op.like]: `%${query}%` } },
                        { model: { [Op.like]: `%${query}%` } }
                    ]
                }
            });

            console.log("✅ Items searched successfully with query:", query);
            return this.response(res, 200, true, "جستجو با موفقیت انجام شد.", items);
        } catch (error) {
            console.error("❌ Error in search:", error);
            return this.response(res, 500, false, "خطا در جستجوی آیتم‌ها", null, error);
        }
    }
}

module.exports = new ItemController(); 