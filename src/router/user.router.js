const express = require("express")
const User = require('../model/user.mongo');
const {createUser, loginUser, deleteUser, updateUser, authenticateToken} = require("../controller/user.controller")



const usersRouter = express.Router();


usersRouter.post('/', createUser)
usersRouter.post('/:login', loginUser)
usersRouter.patch('/:username', updateUser)
usersRouter.delete('/:username', authenticateToken, deleteUser)
// useresRouter.get('/')


module.exports = usersRouter;