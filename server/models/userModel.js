module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('users', {
        name: {type: DataTypes.STRING, allowNull: false},
        otp: {type: DataTypes.STRING},
        otp_expiration_date: {type: DataTypes.STRING},
        phone_number: {type: DataTypes.STRING, allowNull: false},
    })
    return user;
}