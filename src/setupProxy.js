const {createProxyMiddleware} = require("http-proxy-middleware");


module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: process.env.REACT_APP_API_URL,
            changeOrigin: true,
            secure: false,
        }),
    );
    app.use(
        "/clone",
        createProxyMiddleware({
            target: process.env.REACT_APP_API_URL_S3_CLONE,
            changeOrigin: true,
            secure: false,
        }),
    );
};
