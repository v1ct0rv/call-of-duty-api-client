import winston from "winston";
import expressWinston from "express-winston";
import "winston-mongodb";

const logger = function (req, res, next) {
  expressWinston.logger({
    transports: [
      new winston.transports.MongoDB({
        db: process.env.MONGO_DB_URI,
        options: { useUnifiedTopology: true },
        metaKey: "meta",
      }),
    ],
    format: winston.format.json({ space: 2 }),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  });
  next();
};
export default logger;
