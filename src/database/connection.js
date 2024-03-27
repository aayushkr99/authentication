const Sequelize  = require("sequelize");
const config = require("../config/config.json");

const profileModel = require("./model/profileModel")
const userModel = require("./model/userModel")


const connection = {
  timezone: "+05:30",
  ...config.development,
  logging: false, // Enable logging for development
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }, dialectOptions: {
    connectTimeout: 60000, // Set a higher timeout value (in milliseconds)
  },
};

const sequelize = new Sequelize(connection);

const profile = profileModel(sequelize, Sequelize);
const user = userModel(sequelize, Sequelize);

user.hasOne(profile, { foreignKey: 'user_id', onDelete: 'CASCADE' });

profile.belongsTo(user, { foreignKey: 'user_id', onDelete: 'CASCADE' });


module.exports = sequelize;