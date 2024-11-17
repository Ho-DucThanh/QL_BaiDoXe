const User = require("./UserModel");

const UserController = {


  createUser: async (req, res) => {
    const { userName, password, rfid } = req.body;
    if (!userName || !password || !rfid) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const newUser = new User({ userName, password, rfid });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },


  login: async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const user = await User.findOne({ userName });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  
  logout: (req, res) => {
    res.status(200).json({ message: "Logout successful" });
  },
};

module.exports = UserController;
