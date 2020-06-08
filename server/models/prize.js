const { query } = require("../../common/db")

/**
 * 通过openId获取用户信息
 * @param  openId 编号
 */
export async function GetUserByOpenId(openId) {
    return await query("SELECT * FROM PRIZE_USER WHERE openId=?", [openId])
}

/**
 * 更新指定id的用户信息
 * @param {*} openId 编号
 * @param {*} data 数据对象
 */
export async function SetUserByOpenId(openId, data) {
    return await query("UPDATE PRIZE_USER SET drawCount=?,prizeList=? WHERE openId=?", [data.drawCount, data.prizeList, openId])
}

/**
 * 插入一条用户信息
 * @param {*} data 数据对象
 */
export async function InsertUser(data) {
    return await query("INSERT INTO PRIZE_USER (openId,name,drawCount,mobile,prizeList) VALUES (?,?,?,?,?)", [data.openId, data.name, data.drawCount, data.mobile, data.prizeList])
}

