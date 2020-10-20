export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  agora: {
    api: process.env.AGORA_API,
    appId: process.env.AGORA_APP_ID,
    certificate: process.env.AGORA_APP_CERTIFICATE,
    key: process.env.AGORA_AUTH_KEY,
    secret: process.env.AGORA_AUTH_SECRET
  }
});
