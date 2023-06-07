const express = require('express');
const router = express.Router();
const { loginController, logoutController, refershTokenController, registerController } = require('./../Controllers/Auth.Controller')


router.post('/register', registerController)

router.post('/login', loginController)

router.post('/refresh-token', refershTokenController)

router.delete('/logout', logoutController)


module.exports = router;