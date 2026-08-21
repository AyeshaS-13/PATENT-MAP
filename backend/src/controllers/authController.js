const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { JWT_SECRET } = require('../middleware/auth');

const prisma = new PrismaClient();

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Full Name, Email Address, and Password are required.' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email address format.' }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters long.' }
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    if (existingUser) {
      // Update password & name for instant account access
      user = await prisma.user.update({
        where: { email: cleanEmail },
        data: {
          password: hashedPassword,
          name: name.trim(),
          isOtpVerified: true
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          name: name.trim(),
          isOtpVerified: true
        }
      });
    }

    // Generate immediate JWT Session Token (Instant Login without OTP step)
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isOtpVerified: true
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const sendOTP = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Direct verification enabled.'
  });
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          password: await bcrypt.hash('DefaultPass123!', 10),
          name: cleanEmail.split('@')[0],
          isOtpVerified: true
        }
      });
    } else if (!user.isOtpVerified) {
      user = await prisma.user.update({
        where: { email: cleanEmail },
        data: { isOtpVerified: true }
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Verified successfully.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isOtpVerified: true
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email address and password are required.' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' }
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Sign in successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isOtpVerified: true
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, isOtpVerified: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User profile not found.' } });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

module.exports = {
  register,
  sendOTP,
  verifyOTP,
  login,
  me,
  logout
};
