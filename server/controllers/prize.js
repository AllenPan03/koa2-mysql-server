const { renderData } = require("../../common/render")
const rp = require("request-promise")
const sign = require('../../common/sign')
const { client, getAsync } = require('../../common/redis')
const { appId, appSecret } = require('../../common/config')
const { InsertUser, SetUserByOpenId, GetUserByOpenId } = require('../models/prize')

/**
 * 获取用户信息
 * @param {*} ctx 
 */
export async function getUser(ctx) {
    // const openId = 'oXWIz5kAy_nkjLvEhICFVuBlSQjE';
    const { code, openId } = ctx.query;
    let accessToken = await getAsync('access_token');
    let refreshToken = await getAsync('refresh_token');
    if (openId) {
        if (accessToken) {
            try {
                const userData = await getUserInfo(accessToken, openId)
                renderData(ctx, userData, 0)
            } catch (error) {
                renderData(ctx, null, -1, error)
            }
        } else {
            // accessToken过期
            try {
                const newAccessToken = await rp.get(`https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${appId}&grant_type=${refreshToken}&refresh_token=REFRESH_TOKEN`, {
                    json: true
                });
                accessToken = tokenBody.access_token;
                client.set('access_token', accessToken, 'EX', 7198);
                client.set('refresh_token', newAccessToken.refresh_token, 'EX', 30 * 24 * 3598);
                const userData = await getUserInfo(accessToken, openId)
                renderData(ctx, userData, 0)
            } catch (error) {
                renderData(ctx, null, -1, error)
            }
        }
    } else if (code) {
        try {
            // 通过code换取网页授权access_token
            const tokenBody = await rp.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`, {
                json: true
            });
            if (tokenBody.openid) {
                accessToken = tokenBody.access_token;
                refreshToken = tokenBody.refresh_token;//用于刷新access_token
                client.set('access_token', accessToken, 'EX', 7198);
                client.set('refresh_token', refreshToken, 'EX', 30 * 24 * 3598);
                const userData = await getUserInfo(accessToken, tokenBody.openid)
                renderData(ctx, userData, 0)
            } else {
                renderData(ctx, null, -1, tokenBody.errmsg)
            }
        } catch (error) {
            renderData(ctx, null, -1, error)
        }
    } else {
        // 向用户发起授权请求，通过后重定向到指定页面
        ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=http%3A%2F%2Fyunheyihaofu.jinlins.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
    }
}
/**
 * 拉取用户信息
 * @param {string} access_token 
 * @param {string} openid 
 */
async function getUserInfo(access_token, openid) {
    const userData = await rp.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`, {
        json: true
    });
    return userData;
}
/**
 * 抽奖
 * @return 抽奖
 */
export async function getPrize(ctx) {
    // const openId = 'oXWIz5kAy_nkjLvEhICFVuBlSQjE';
    const { openId, name, mobile } = ctx.query;
    if (openId) {
        // 去数据库查找是否有匹配的openId，有则判断抽奖次数是否超过3次，没有则插入一条数据
        const prizeNum = await luckyDraw();
        const userInfo = await GetUserByOpenId(openId);
        if (userInfo.length > 0) {
            if (userInfo[0].drawCount < 3) {
                let prizeList = userInfo[0].prizeList.split(',');
                userInfo[0].drawCount++;
                prizeList.push(prizeNum);
                userInfo[0].prizeList = prizeList.join(',');
                try {
                    await SetUserByOpenId(openId, userInfo[0]);
                    renderData(ctx, { prizeNum: prizeNum, times: (3 - userInfo[0].drawCount) }, 0, "成功")
                } catch (error) {
                    renderData(ctx, null, -1, error)
                }
            } else {
                renderData(ctx, null, -2, "次数已用完")
            }
        } else {
            const userData = {
                openId, name, drawCount: 1, mobile, prizeList: prizeNum
            }
            try {
                await InsertUser(userData)
                renderData(ctx, { prizeNum: prizeNum }, 0, "成功")
            } catch (error) {
                renderData(ctx, null, -1, error)
            }
        }
    } else {
        renderData(ctx, null, -1, '参数有误')
    }
}

async function luckyDraw() {
    const prizeNum = '1'
    return prizeNum;
}

