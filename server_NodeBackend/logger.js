const winston = require("winston");
require("winston-cloudwatch");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),

    new winston.transports.CloudWatch({
      logGroupName: "music-backend-logs",
      logStreamName: "backend-stream",

      awsRegion: "us-east-1",

      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
  ],
});

module.exports = logger;