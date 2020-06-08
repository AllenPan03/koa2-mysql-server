const koa = require("koa");
const bodyParser = require("koa-bodyparser")
const router = require('./routers/index')
const { interceptLogin, cross, adaptRouteSuffix, onerror } = require("../common/middleware")
const pkg = require("../package.json")
const app = new koa();
app.use(onerror()); // 系统错误,统一错误捕获
app.use(bodyParser()) // ctx.body 解析中间件
app.use(cross()) // 跨域请求头
app.use(router.routes()).use(router.allowedMethods()) // 加载路由中间件

function listen() {
    app.listen(pkg.port, () => console.log(`start - up success, listening port ${pkg.port} `.green))
}
listen();