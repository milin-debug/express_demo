const express = require('express')
const router = express.Router()

// 导入用户信息的处理函数模块
const userinfo_handler = require('../routerHandler/userinfo')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

module.exports = router