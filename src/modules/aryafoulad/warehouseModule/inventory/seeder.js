const Inventory = require('./model');
const seederData = require('./seederData.json');

async function seedInventories() {
    try {
        console.log('🌱 Starting inventory seeding...');

        // کمی صبر می‌کنیم تا مطمئن شویم انبارها ساخته شده‌اند
        await new Promise(resolve => setTimeout(resolve, 1000));

        // حذف داده‌های قبلی
        await Inventory.destroy({ where: {}, force: true });
        console.log('✅ Previous inventory data cleared');

        // ایجاد داده‌های جدید
        const inventories = await Inventory.bulkCreate(seederData);
        console.log(`✅ ${inventories.length} inventories seeded successfully`);

        return inventories;
    } catch (error) {
        console.error('❌ Error seeding inventories:', error);
        throw error;
    }
}

module.exports = seedInventories; 