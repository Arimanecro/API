import ErrorResponse from "../classes/errorResponse.js";
import jwt from "jsonwebtoken";
import { cnx, ObjectId } from "../config/mongoDB.js";

export default (req, res, next) => {
  let token;

  // Make sure header "Authorization" exists
  if (
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie.token) {
    token = req.cookie.token;
  }

  // Exists token or not
  !token ? next(new ErrorResponse(`Not authorized.`, 401)) : null;

  // Verification of token
  try {
    const decodeId = jwt.verify(token, process.env.JWT_SECRET_WORD)["id"];
    cnx
      .then((mongo) => mongo.db("job"))
      .then((d) => {
        d.collection("profiles").findOne(
          { _id: ObjectId(decodeId) },
          (err, data) => {
            req.user = data;
          }
        );
      });

    next();
  } catch (e) {
    console.log(e);
    next(new ErrorResponse(`Not authorized.`, 401));
  }
};
