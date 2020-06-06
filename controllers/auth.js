import { cnx } from "../config/mongoDB.js";
import ErrorResponse from "../classes/errorResponse.js";
import Cookie from "../classes/cookie.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//@desc     Check login & password
//@route    POST /api/job/auth

export const checkAuth = async (req, res, next) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return next(
      new ErrorResponse(`Fields Login and Password doesn't exist.`, 404)
    );
  }
  try {
    cnx
      .then((mongo) => mongo.db("job"))
      .then((d) => {
        d.collection("profiles").findOne({ Email: email }, (err, data) => {
          if (!data) {
            return next(new ErrorResponse(`Invalid login or password`, 404));
          }
          const match = bcrypt.compareSync(pass, data["Password"]);
          if (!match) {
            return next(new ErrorResponse(`Invalid login or password`, 404));
          }
          const token = jwt.sign(
            { email: data.email },
            process.env.JWT_SECRET_WORD,
            { expiresIn: process.env.JWT_PERIOD }
          );
          Cookie.set(res, token, 201);
        });
      })
      .catch((e) =>
        next(next(new ErrorResponse(`Invalid login or password`, 404)))
      );
  } catch (e) {
    next(e);
  }
};
