"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // email: DataTypes.STRING,
    //   password: DataTypes.STRING,
    //   firstName: DataTypes.STRING,
    //   lastName: DataTypes.STRING,
    //   address: DataTypes.STRING,
    //   gender: DataTypes.BOOLEAN,
    //   roleId: DataTypes.STRING,
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: "10122001",
        firstName: "minhdz",
        lastName: "handsome",
        address: "USA",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
