const { DataTypes } = require('sequelize');
const sequelize = require('../../../../core/database/mysql/connection');

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    equipment_code: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    ownership: {
        type: DataTypes.ENUM('ملکی', 'استیجاری'),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    calibration_certificate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    calibration_period_years: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    calibration_place: {
        type: DataTypes.STRING,
        allowNull: true
    },
    has_identity_document: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    minQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    maxQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Item; 