const UserRole = require("./model");
const { User, Role } = require("../associations"); // Import User and Role models
const userRoleSeederData = require("./seederData.json");

const seedUserRoles = async () => {
  try {
    await UserRole.bulkCreate(userRoleSeederData, {
      ignoreDuplicates: true, // برای جلوگیری از خطای تکراری شدن کلید اصلی در صورت وجود رکورد از قبل
    });
    console.log("User roles seeded successfully!");
  } catch (error) {
    console.error("Error seeding user roles:", error);
  }
};

module.exports = seedUserRoles; 