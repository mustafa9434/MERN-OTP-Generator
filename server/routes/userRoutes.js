const { createUserValidations, CreateUser, generateOTP, verifyOTP } = require('../controllers/userController');

const router = require('express').Router();

router.post('/users', createUserValidations, CreateUser);
router.post('/users/generateOTP', generateOTP);
router.get('/users/:user_id/verifyOTP', verifyOTP);


module.exports = router;