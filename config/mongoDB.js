import MongoClient from "mongodb";
import BSON from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

export const cnx = new MongoClient(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const ObjectId = BSON.ObjectId;
