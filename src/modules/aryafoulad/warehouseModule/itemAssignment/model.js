const { DataTypes } = require('sequelize');
const sequelize = require('../../../../core/database/mysql/connection');
const Item = require('../item/model');
const User = require('../../../user/user/model');

const ItemAssignment = sequelize.define('ItemAssignment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Items',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Projects',
            key: 'id'
        }
    },
    assignmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('assigned', 'returned', 'lost'),
        allowNull: false,
        defaultValue: 'assigned'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

// تعریف روابط
ItemAssignment.belongsTo(Item, {
    foreignKey: 'itemId',
    as: 'item'
});

ItemAssignment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = ItemAssignment; 