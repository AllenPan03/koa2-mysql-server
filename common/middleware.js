const { renderData } = require("./render")
const { log } = require("./utils")
/**
 * 跨域处理
 * @example app.use(cross())
 */
export function cross() {
    return async function (ctx, next) {
        ctx.set('Access-Control-Allow-Origin', ctx.get("Origin") == null ? "*" : ctx.get("Origin"));
        ctx.set('Access-Control-Allow-Methods', ctx.get("Access-Control-Request-Method") || "PUT, GET, POST, DELETE, OPTIONS");
        ctx.set('Access-Control-Allow-Headers', ctx.get("Access-Control-Request-Headers") || "Content-Type");
        ctx.set('Access-Control-Allow-Credentials', "true");

        if (ctx.method == "OPTIONS") {
            ctx.status = 204
        }
        await next();
    }
}

/**
 * 兼容路由后缀，如 xxx/xxx.json == xxx/xxx 地址
 * @param suffixes string[] 后缀列表
 * @example app.use(adaptRouteSuffix([".json"]))
 */
export function adaptRouteSuffix(suffixes = []) {
    return async function (ctx, next) {
        suffixes.forEach(e => {
            var re = new RegExp(e);
            ctx.path = ctx.path.replace(re, "")
        })
        await next();
    }
}

/**
 * 错误日志捕获
 * @example app.use(onerror())
 */
export function onerror() {
    return async function (ctx, next) {
        try {
            await next();
            if (ctx.status == 404) {
                var err = new Error('Not Found');
                err.status = 404;
                await ctx.render("404");
            }
        } catch (err) {
            renderData(ctx, null, -1, "服务端错误", err.message)
            log(err.message)
        }
    }
}

/** 
 * 延迟
 * @example await delay(5000) // 延迟5s
 */
export function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, time);
    });
};