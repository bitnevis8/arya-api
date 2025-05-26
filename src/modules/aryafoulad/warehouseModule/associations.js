const Item = require('./item/model');
const Inventory = require('./inventory/model');
const Warehouse = require('./warehouse/model');
const StockHistory = require('./stockHistory/model');
const ItemAssignment = require('./itemAssignment/model');
const User = require('../../user/user/model');
// const Project = require('../../project/project/model');

// روابط انبار و موجودی (One-to-Many)
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

// روابط کالا و موجودی (One-to-Many)
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

// روابط کالا و تخصیص (One-to-Many)
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

// روابط موجودی و تاریخچه (One-to-Many)
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

// روابط تخصیص و کاربر (Many-to-One)
ItemAssignment.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'assignedUser',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// روابط تخصیص و پروژه (Many-to-One)
// ItemAssignment.belongsTo(Project, { 
//     foreignKey: 'projectId', 
//     as: 'project',
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
// });

module.exports = {
    Item,
    Inventory,
    Warehouse,
    StockHistory,
    ItemAssignment
};
