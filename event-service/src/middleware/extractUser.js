const extractUserFromHeader = (req, res, next) => {
  if (req.headers["x-user"]) {
    try {
      const base64User = req.headers["x-user"];
      const decodedUser = Buffer.from(base64User, "base64").toString("utf-8");
      req.user = JSON.parse(decodedUser);
    } catch (error) {
      console.error("Failed to decode user from header:", error.message);
      req.user = null;
    }
  }
  next();
};

export default extractUserFromHeader;
