import dotenv from "@/utils/dotenv";

dotenv.config();

const configs = {
  port: process.env.PORT || 4001,
  mongo_uri: process.env.MONGO_URI
}

const env = process.env.NODE_ENV;
if (env === "development") {
  Object.assign(configs, {
    // Development Configs Goes Here
  })
} else if (env === "production") {
  Object.assign(configs, {
    // Production Configs Goes Here
  })
}

export default Object.freeze(configs)
