module.exports.auth = async (req, res, next) => {
  try {
    const a = 2;
    if (a == 2) {
      req.user = "vedang";
    } else {
      throw new Error("error there");
    }
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
