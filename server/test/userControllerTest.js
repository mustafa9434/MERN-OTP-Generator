const assert = require('assert');
const userController = require('../controllers/userController');
const data = {"name": "Muhammad Mustafa", "phone_number": "03018952297"}

describe('userController', () => {
    it('should create and return user', () => {
        
        assert.equal(userController.CreateUser(), data)
    });
})