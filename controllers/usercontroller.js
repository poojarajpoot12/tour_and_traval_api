const users = require('../models/userschema');

exports.userlist = async (req, res) => {
  try {
    const userdata = await users.find();
    res.json(userdata);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.singleuserlist = async (req, res) => {
  const userid = req.params.id;
  const specificdata = await users.findById(userid);
  res.send({ message: specificdata });
};

exports.registration = async (req, res) => {
  try {
    const { fullname, email, mobileno, password } = req.body;
    const profilePic = req.file ? req.file.filename : '';

    const existingEmail = await users.findOne({ email });
    if (existingEmail) return res.send({ message: 'Email already registered' });

    const existingMobile = await users.findOne({ mobileno });
    if (existingMobile) return res.send({ message: 'Mobile number already registered' });

    const newUser = new users({ fullname, email, mobileno, password, profilePic });
    await newUser.save();

    res.send({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Admin check
    if (email === 'admin@gmail.com' && password === 'admin123') {
      return res.json({
        message: 'Admin login successful',
        user: { email, role: 'admin', fullname: 'Admin', mobileno: '', profilePic: '' }
      });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // For now (plain comparison, better use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        role: 'user',
        fullname: user.fullname,
        mobileno: user.mobileno,
        profilePic: user.profilePic
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user
    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields
    const { fullname, mobileno, password } = req.body;
    if (fullname) user.fullname = fullname;
    if (mobileno) user.mobileno = mobileno;
    if (password) user.password = password;

    // If a new profile pic is uploaded
    if (req.file) {
      // Delete old pic from uploads
      if (user.profilePic) {
        const oldPath = path.join(__dirname, '../uploads', user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilePic = req.file.filename;
    }

    const updatedUser = await user.save();
    res.json({ message: 'User updated', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteuser = async (req, res) => {
  const userid = req.params.id;
  await users.findByIdAndDelete(userid);
  res.send({ message: 'Delete Successfully' });
};

exports.userdelete = async (req, res) => {
  const user_id = req.params.id;
  await users.findByIdAndDelete(user_id);
  res.send({ message: 'User delete successfully' });
};
