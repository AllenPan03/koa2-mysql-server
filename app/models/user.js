const { query } = require("../../config/db")

/**
 * 查询指定id的用户
 * @param {*} uid 用户UID
 */
export async function GetUser(uid) {
    return await query("SELECT * FROM TEST_USER WHERE ID=?", [uid]);
}

/**
 * 插入一条用户信息
 * @param {*} data 数据对象
 */
export async function InsertUser(data) {
    return await query("INSERT INTO TEST_USER (name,mobile,email) VALUES (?,?,?)", [data.name, data.mobile, data.email])
}

