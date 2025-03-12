const extractUserFromHeader = (req, res, next) => {
  if (req.headers["x-user"]) {
    req.user = JSON.parse(req.headers["x-user"]);
  }
  next();
};

export default extractUserFromHeader;