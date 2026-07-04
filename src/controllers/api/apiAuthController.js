const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

exports.getTokens = (req, res) => {
  const { name, code } = req.body;

  try {
    const filePath = path.join(__dirname, "../../data/members.json");
    const membersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const account = membersData.find((m) => m.name === name);

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
