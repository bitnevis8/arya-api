const User = require('./aryafoulad/user/model');
const Role = require('./aryafoulad/role/model');
const { MissionOrder, MissionCompanion } = require('./aryafoulad/missionOrder/model');
const FileUpload = require('./fileUpload/model');
const Item = require('./aryafoulad/warehouseModule/item/model');
const Inventory = require('./aryafoulad/warehouseModule/inventory/model');
const Warehouse = require('./aryafoulad/warehouseModule/warehouse/model');
const StockHistory = require('./aryafoulad/warehouseModule/stockHistory/model');
const ItemAssignment = require('./aryafoulad/warehouseModule/itemAssignment/model');

// تعریف ارتباطات بین مدل‌ها
const defineAssociations = () => {
    // ارتباطات مربوط به کاربران و نقش‌ها
    User.belongsTo(Role, { 
        foreignKey: "roleId", 
        as: "role",
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    Role.hasMany(User, { 
        foreignKey: "roleId", 
        as: "users" 
    });

    // ارتباطات مربوط به ماموریت‌ها
    MissionOrder.belongsTo(User, { 
        foreignKey: 'userId', 
        as: 'user',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    MissionOrder.belongsToMany(User, { 
        through: MissionCompanion, 
        as: 'missionCompanions',
        foreignKey: 'missionOrderId',
        otherKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    User.belongsToMany(MissionOrder, { 
        through: MissionCompanion, 
        as: 'missions',
        foreignKey: 'userId',
        otherKey: 'missionOrderId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // ارتباطات مربوط به فایل‌ها
    MissionOrder.hasMany(FileUpload, {
        foreignKey: 'missionOrderId',
        as: 'files',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    FileUpload.belongsTo(MissionOrder, {
        foreignKey: 'missionOrderId',
        as: 'missionOrder',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // ارتباطات مربوط به انبار
    Warehouse.hasMany(Inventory, { 
        foreignKey: 'warehouseId', 
        as: 'inventories',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    Inventory.belongsTo(Warehouse, { 
        foreignKey: 'warehouseId', 
        as: 'warehouse',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });

    // ارتباطات مربوط به کالا
    Item.hasMany(Inventory, { 
        foreignKey: 'itemId', 
        as: 'inventories',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    Inventory.belongsTo(Item, { 
        foreignKey: 'itemId', 
        as: 'item',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });

    // ارتباطات مربوط به تخصیص کالا
    Item.hasMany(ItemAssignment, { 
        foreignKey: 'itemId', 
        as: 'assignments',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    ItemAssignment.belongsTo(Item, { 
        foreignKey: 'itemId', 
        as: 'assignedItem',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });

    // ارتباطات مربوط به تاریخچه موجودی
    Inventory.hasMany(StockHistory, { 
        foreignKey: 'inventoryId', 
        as: 'stockHistory',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    StockHistory.belongsTo(Inventory, { 
        foreignKey: 'inventoryId', 
        as: 'inventory',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // ارتباطات مربوط به تخصیص و کاربر
    ItemAssignment.belongsTo(User, { 
        foreignKey: 'userId', 
        as: 'assignedUser',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
};

module.exports = defineAssociations; 