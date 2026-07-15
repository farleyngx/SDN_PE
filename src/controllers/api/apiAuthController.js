const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../../models/Member");

exports.getTokens = async (req, res) => {
  const { name, code } = req.body;

  try {
    const account = await Member.findOne({ name });

    if (!account) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = bcrypt.compareSync(code, account.code);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ name: account.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
