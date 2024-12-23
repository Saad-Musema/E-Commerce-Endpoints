const express = require("express")
const User = require('../model/user.mongo');
const {createUser, loginUser, deleteUser} = require("../controller/user.controller")



const usersRouter = express.Router();


usersRouter.post('/', createUser)
usersRouter.post('/:login', loginUser)
usersRouter.get('/')
usersRouter.put('/')
usersRouter.delete('/:id', deleteUser)

module.exports = usersRouter;