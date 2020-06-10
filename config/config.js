/** 调试模式 */
export const debug = process.platform !== "linux";

/** 服务器端口 */
export const serverPort = 3000;

/** 服务器部署地址 */
export const serverUrl = debug ? "//localhost:" + serverPort : "//xxx.com";

