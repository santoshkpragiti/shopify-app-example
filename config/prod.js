// prod.js with KEYS from environment
module.exports = {
  apiKey : process.env.API_KEY,
  sharedSecret: process.env.SHARED_SECRET,
  redirectDomain: process.env.REDIRECT_DOMAIN,
  redirectUri: process.env.REDIRECT_URI,
  secretSession: process.env.SECRET_SESSION,
  mongoUri: process.env.MONGO_URI
};