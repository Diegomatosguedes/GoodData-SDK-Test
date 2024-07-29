const PROXY_CONFIG = [
  {
    context: [
      "/carol"
    ],
    "changeOrigin": true,
    "secure": false,
    "target": "https://totvstechfindev.carol.ai",
    "cookieDomainRewrite": "analytics.totvs.carol",
    "cookiePathRewrite": "/",
    "headers": {
      "host": "https://totvstechfindev.carol.ai",
      "origin": null
    },
    "pathRewrite": {
      "^/carol": ""
    } 
  },
  {
    context: [
      "/gooddata"
    ],
    "changeOrigin": true,
    "secure": false,
    "target": "https://bossy-fly.trial.cloud.gooddata.com",
    "cookieDomainRewrite": "analytics.totvs.carol",
    "cookiePathRewrite": "/",
    "headers": {
      "host": "https://bossy-fly.trial.cloud.gooddata.com",
      "origin": null
    },
    "pathRewrite": {
      "^/gooddata": ""
    }
  }
]

module.exports = PROXY_CONFIG;