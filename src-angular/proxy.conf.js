const PROXY_CONFIG = [
  {
    context: [
      "/carol"
    ],
    "changeOrigin": true,
    "secure": false,
    "target": "https://totvstechfindev.carol.ai",
    "cookieDomainRewrite": "analytics.totvs.teste",
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
    "target": "https://analytics.totvs.teste:8084",
    "cookieDomainRewrite": "analytics.totvs.teste",
    "cookiePathRewrite": "/",
    "headers": {
      "host": "https://analytics.totvs.teste:8084",
      "origin": null
    },
    "pathRewrite": {
      "^/gooddata": ""
    }
  },
  {
    context: [
      "/static"
    ],
    "changeOrigin": true,
    "target": "https://s3.amazonaws.com/pages-myfluig-qa-us-east-1"
  },
  {
    context: [
      '/manager/api',
      '/accounts'
    ],
    "changeOrigin": true,
    "target": "https://api-fluig.dev.totvs.app"
  },
  {
    context: [
      "/core/api/v2/notification"
    ],
    "changeOrigin": true,
    "target": "https://communication.dev.totvs.app"
  }
];

module.exports = PROXY_CONFIG;