const express = require('express')
const app = express()
const cors = require('cors')
const {expressjwt:jwt} = require('express-jwt')
app.use(cors())
app.use(express.urlencoded({ extended: false }))

const {jwtSecretKey} = require('./config')
// 解析 token 的中间件

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(jwt({ secret: jwtSecretKey , algorithms: ["HS256"]}).unless({ path: [/^\/api\//] }))


// 响应数据的中间件
app.use(function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function (err, status = 1) {
      res.send({
        // 状态
        status,
        // 状态描述，判断 err 是 错误对象 还是 字符串
        message: err instanceof Error ? err.message : err,
      })
    }
    next()
  })




app.use('/api', require('./router/user'))
app.use('/my',  require('./router/userinfo'))


//错误处理 只可以处理同步业务，异步业务要自己写代码

app.use((err, req, res, next) => {
    //这里没有res.cc  全局响应中间件拿不到  ,黑马项目有问题
    if (err.name === 'UnauthorizedError') {
      return  res.send({ message: err.message})
    }
    // res.status(500).json({ message: err.message})
    res.send('错误')
  })
       


app.listen(3007, function () {
 console.log('api server running at http://127.0.0.1:3007')
})