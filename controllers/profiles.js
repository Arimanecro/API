import { cnx, ObjectId } from "../config/mongoDB.js";
import ErrorResponse from "../classes/errorResponse.js";
import Cookie from "../classes/cookie.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//@desc     Get all profiles
//@route    GET /api/job/profiles

export const getProfiles = async (req, res, next) => {
  try {
    cnx
      .then((c) => c.db("job"))
      .then((d) => {
        d.collection("profiles")
          .find({})
          .toArray((err, result) => {
            res.status(200).json({ success: true, result });
          });
      });
  } catch (e) {
    next(e);
  }
};

//@desc     Get only single profile
//@route    GET /api/job/profiles/:uid

export const getProfile = async (req, res, next) => {
  try {
    cnx
      .then((mongo) => mongo.db("job"))
      .then((d) => {
        d.collection("profiles").findOne(
          { _id: ObjectId(req.params.uid) },
          (err, data) => {
            res.status(200).json({ success: true, data });
          }
        );
      })
      .catch((e) =>
        next(new ErrorResponse(`Not found id: ${req.params.uid}`, 404))
      );
  } catch (e) {
    next(e);
  }
};

//@desc     Create new profile
//@route    POST /api/job/profiles

export const createProfile = async (req, res, next) => {
  try {
    cnx
      .then((mongo) => mongo.db("job"))
      .then(async (d) => {
        const salt = await bcrypt.genSalt(8);
        req.body["Password"] = await bcrypt.hash(req.body["Password"], salt);

        await d.collection("profiles").insertOne(req.body, (err, profile) => {
          const token = jwt.sign(
            { id: profile.ops[0]["_id"] },
            process.env.JWT_SECRET_WORD,
            { expiresIn: process.env.JWT_PERIOD }
          );
          Cookie.set(res, token, 201);
        });
      })
      .catch((e) =>
        next(new ErrorResponse(`Cant't to create a new profile.`, 400))
      );
  } catch (e) {
    next(e);
  }
};

//@desc     Update profile completely or partially
//@route    PUT & PATCH /api/job/profiles/:token
//@access   Private

export const updateProfile = async (req, res, next) => {
  try {
    cnx
      .then((mongo) => mongo.db("job"))
      .then((d) => {
        const uid = jwt.verify(req.cookie.token, process.env.JWT_SECRET_WORD)[
          "id"
        ];
        d.collection("profiles").updateOne(
          { _id: ObjectId(uid) },
          { $set: req.body },
          (err, result) => {
            res.status(204).json({ success: true });
          }
        );
      })
      .catch((e) => next(new ErrorResponse(`Cant't update the profile.`, 400)));
  } catch (e) {
    next(e);
  }
};

//@desc     Delete profile completely
//@route    DELETE /api/job/profiles/:token
//@access   Private

export const deleteProfile = async (req, res, next) => {
  try {
    cnx
      .then((mongo) => mongo.db("job"))
      .then((d) => {
        const uid = jwt.verify(req.cookie.token, process.env.JWT_SECRET_WORD)[
          "id"
        ];
        d.collection("profiles").deleteOne(
          { _id: ObjectId(uid) },
          (err, result) => {
            res.status(204).json({ success: true });
          }
        );
      })
      .catch((e) => next(new ErrorResponse(`Cant't update the profile.`, 400)));
  } catch (e) {
    next(e);
  }
};
