const db = require('../db/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// 检测表单数据是否合法
// 检测用户名是否被占用
// 对密码进行加密处理
// 插入新用户

exports.regUser = (req, res) => {
  const userinfo = req.body

  const sql = `select * from ev_users where username=?`
  db.query(sql, [userinfo.username], function (err, results) {

    if (err) {
      return res.cc(err)

    }
    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {

      return res.cc('用户名或密码不能为空！')
    }
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    //嵌套可以吗
    const sql1 = 'insert into ev_users set ?'
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    db.query(sql1, {
      username: userinfo.username,
      password: userinfo.password
    }, function (err, results) {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试！')
      }
      // 注册成功
      return res.cc('注册成功！', 0)
    })
  })
}

// 检测表单数据是否合法
// 根据用户名查询用户的数据
// 判断用户输入的密码是否正确
// 生成 JWT 的 Token 字符串
exports.login = (req, res) => {
  const userinfo = req.body
  const sql = `select * from ev_users where username=?`
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.cc('登录失败！')
    // TODO：判断用户输入的登录密码是否和数据库中的密码一致
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！')
    }
    const user = { ...results[0], password: '', user_pic: '' }
    const {jwtSecretKey} = require('../config')
    const tokenStr = jwt.sign(user, jwtSecretKey, {
      expiresIn: '10h', // token 有效期为 10 个小时
    })
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    })
  })
}