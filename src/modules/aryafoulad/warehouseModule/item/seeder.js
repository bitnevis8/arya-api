const Item = require('./model');
const seederData = require('./seederData.json');

const seedItems = async () => {
    try {
        console.log('🌱 Starting items seeding...');
        
        // حذف تمام آیتم‌های موجود
        await Item.destroy({ where: {} });
        console.log('✅ Existing items deleted');

        // ایجاد آیتم‌های جدید
        await Item.bulkCreate(seederData);
        console.log('✅ Items seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding items:', error);
        throw error;
    }
};

module.exports = seedItems; 