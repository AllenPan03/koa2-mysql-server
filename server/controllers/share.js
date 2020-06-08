const { renderData } = require("../../common/render")
const rp = require("request-promise")
const sign = require('../../common/sign')
const { client, getAsync } = require('../../common/redis')
const { appId, appSecret } = require('../../common/config')

/**
 * 微信分享
 * @return 微信功能
 */
export async function getShareCfg(ctx) {
    const currentUrl = ctx.query.currentUrl;
    let jsapiTicket = await getAsync('jsapi_ticket');
    if (!jsapiTicket) {
        const tokenBody = await rp.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`, {
            json: true
        })
        const access_token = tokenBody.access_token;
        client.set('access_token', access_token, 'EX', 7198);
        const ticketBody = await rp.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, {
            json: true
        })
        jsapiTicket = ticketBody.ticket;
        client.set('jsapi_ticket', jsapiTicket, 'EX', 7198)
    }
    try {
        const newData = await sign(jsapiTicket, currentUrl);
        renderData(ctx, newData, 0)
    } catch (error) {
        renderData(ctx, null, -1, error)
    }
}
