const mongodbConfig = {
  host: process.env.MONGO_DB_HOST,
  port: +process.env.MONGO_DB_PORT,
  database: process.env.MONGO_DB_NAME,
  user: process.env.MONGO_DB_USER,
  password: process.env.MONGO_DB_PWD,
}

const redisConfig = {
  host: process.env.REDIS_DB_HOST,
  port: +process.env.REDIS_DB_PORT,
  password: process.env.REDIS_DB_PWD,
}

const serverConfig = {
  port: +process.env.SERVER_PORT,
  hostname: 'localhost',
}
module.exports = {
  mongodbConfig,
  serverConfig,
  redisConfig,
}
