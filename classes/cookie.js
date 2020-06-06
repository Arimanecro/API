export default class Cookie {
  static options = {
    expires: new Date(
      Date.now() + process.env.JWT_PERIOD_COOKIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  static set(res, jwt, statusCode) {
    res.cookie("token", jwt, Cookie.options);
    res.status(statusCode).json({ success: true, jwt });
  }
}
