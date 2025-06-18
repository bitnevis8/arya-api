const sequelize = require("./connection");

// Import user module seeders
const seedRoles = require("../../../modules/user/role/seeder");
const seedUsers = require("../../../modules/user/user/seeder");
const seedUserRoles = require("../../../modules/user/userRole/seeder");

// Import aryafoulad module seeders
const seedUnitLocations = require("../../../modules/aryafoulad/unitLocation/seeder");
const seedRateSettings = require("../../../modules/aryafoulad/rateSettings/seeder");
const seedWarehouses = require("../../../modules/aryafoulad/warehouseModule/warehouse/seeder");
const seedItems = require("../../../modules/aryafoulad/warehouseModule/item/seeder");
const seedInventories = require("../../../modules/aryafoulad/warehouseModule/inventory/seeder");

// Group seeders by module for better organization and control
const userSeeders = [seedRoles, seedUsers, seedUserRoles];
const aryafouladSeeders = [seedUnitLocations, seedRateSettings, seedWarehouses, seedItems, seedInventories];

async function runSeederGroup(seeders, groupName) {
  console.log(`\nRunning ${groupName} Seeders...`);
  for (const seeder of seeders) {
    try {
      await seeder();
      console.log(`✅ ${seeder.name} completed successfully`);
    } catch (error) {
      console.error(`❌ Error in ${seeder.name}:`, error);
      throw error; // Re-throw to stop the seeding process
    }
  }
  console.log(`✅ ${groupName} Seeding completed\n`);
}

async function runSeeders() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Run user module seeders
    await runSeederGroup(userSeeders, "User Data");

    // Run aryafoulad module seeders
    await runSeederGroup(aryafouladSeeders, "Aryafoulad Data");

    console.log("\n✅ All database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  }
}

module.exports = runSeeders; 