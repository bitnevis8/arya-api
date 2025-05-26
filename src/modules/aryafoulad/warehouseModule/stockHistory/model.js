const { DataTypes } = require('sequelize');
const sequelize = require('../../../../core/database/mysql/connection');

const StockHistory = sequelize.define('StockHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Inventories',
            key: 'id'
        }
    },
    previousQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    newQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    changeType: {
        type: DataTypes.ENUM('increase', 'decrease', 'adjustment'),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'stock_histories',
    timestamps: true
});

module.exports = StockHistory; 