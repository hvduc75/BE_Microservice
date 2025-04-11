const extractTokenFromHeader = (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    req.token = token;
    console.log("✅ Extracted token:", req.token);
  }
  next();
};

export default extractTokenFromHeader;