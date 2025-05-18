'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('mission_orders', 'qrCode', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'QR Code برای دسترسی سریع به جزئیات ماموریت'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('mission_orders', 'qrCode');
  }
}; 