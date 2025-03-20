'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Group);
        }
    }
    User.init(
        {
            username: DataTypes.STRING,
            receiverName: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            type: { type: DataTypes.STRING, defaultValue: 'LOCAL' },
            address: DataTypes.STRING,
            gender: DataTypes.INTEGER,
            birthDay: DataTypes.DATE,
            phone: DataTypes.STRING,
            tokenLogin: DataTypes.STRING,
            code: DataTypes.STRING,
            avatar: DataTypes.BLOB('long'),
            groupId: DataTypes.INTEGER,
            refresh_token: DataTypes.TEXT,
            refresh_expired: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
