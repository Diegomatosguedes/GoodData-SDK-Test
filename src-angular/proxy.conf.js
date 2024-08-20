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
    "target": "https://analytics.totvs.carol:8080/GoodData",
    "cookieDomainRewrite": "analytics.totvs.carol",
    "cookiePathRewrite": "/",
    "headers": {
      "host": "https://analytics.totvs.carol:8080/GoodData",
      "origin": null
    },
    "pathRewrite": {
      "^/gooddata": ""
    }
  }
]

module.exports = PROXY_CONFIG;