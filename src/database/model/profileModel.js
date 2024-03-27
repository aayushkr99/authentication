module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserProfile", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    photo: {
      type: DataTypes.STRING,
      defaultValue: "default-user.png",
    },

    visibility: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public",
    },
  });
};

