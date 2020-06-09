const { GetUser, InsertUser } = require("../models/user")
const { renderData } = require("../../common/render")
/**
 * 获取用户信息
 * @return 用户信息对象
 */
export async function getUser(ctx) {
    let id = ctx.query.id
    renderData(ctx, await GetUser(id))
}

/**
 * 添加用户
 * - name // 用户名
 * - email // 邮箱
 * - mobile // 手机号
 */
export async function addUser(ctx) {
    const { name, mobile, email } = ctx.request.body;
    try {
        const result = await InsertUser({ name, mobile, email });
        renderData(ctx, {
            taskId: result.insertId
        }, 0, "添加成功")
    } catch (error) {
        console.log(error)
        renderData(ctx, null, 102, "添加失败：" + error.sqlMessage)
    }
}
