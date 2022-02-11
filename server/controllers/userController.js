const {body, ValidationReslut, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const db = require('../config/db')
const Users = db.user;
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const moment = require('moment');

module.exports.createUserValidations = [
    body('name').not().isEmpty().trim().withMessage("Name is required"),
    body('phone_number').not().isEmpty().trim().withMessage("Phone Number is required")
]
module.exports.CreateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const checkUser = await Users.findOne({where: {phone_number: req.body.phone_number}})
        if (checkUser) {
            return res.status(400).json({errors: [{msg: 'Phone number is already in use'}]})
        }
        try {
            const user = await Users.create({
                name: req.body.name,
                phone_number: req.body.phone_number
            })
            return res.status(200).json({msg: 'User created', user})
            
        } catch (error) {
            return res.status(500).json({errors: [{error}]})
        }
    } catch (error) {
        return res.status(500).json({errors: [{error}]})
    }
}


module.exports.generateOTP = async (req, res) => {
    const checkUser = await Users.findOne({where: {phone_number: req.body.phone_number}});
    if (checkUser) {
        var otp = Math.floor(1000 + Math.random() * 9000);        
        var expiresIn = moment().add(5, 'minutes').format('DD-MM-YYYY hh:mm a');
        const user = await Users.update({
            name: checkUser.name,
            otp: otp,
            otp_expiration_date: expiresIn,
            phone_number: checkUser.phone_number
        }, {where: {
            id: checkUser.id
        }})
        if (user) {
            const userId = checkUser.id;
            return res.status(200).json({msg: 'OTP sended to your registered phone number', userId})
        }

    } else {
        return res.status(400).json({errors: [{msg: 'User not Found'}]})
    }
}

module.exports.verifyOTP = async (req, res) => {
    const {user_id} = req.params;
    const otp = req.query.otp;
    try {
        const user = await Users.findOne({where: {id: user_id}})
        if (user) {
            moment.suppressDeprecationWarnings = true;
            // compare current time with time in database
            const nowTime = moment().format('DD-MM-YYYY hh:mm a');
            const otpTime = user.otp_expiration_date;
            const checkValid = moment(nowTime).isBefore(otpTime);
            if (checkValid) {
                if (user.otp === otp) {
                    return res.status(200).json({msg: 'You have login Successfuly..', user})
                } else {
                    return res.status(400).json({errors: [{msg: 'Wrong OTP'}]})
                }
            } else {
                return res.status(400).json({errors: [{msg: 'OTP is Expired, Try new one'}]})
            }
        }
    } catch (error) {
        return res.status(500).json({errors: [{error}]})
    }
}