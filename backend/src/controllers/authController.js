const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { JWT_SECRET } = require('../middleware/auth');

const prisma = new PrismaClient();

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email, password, and name are required.' }
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
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

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { message: 'An account with this email address already exists.' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isOtpVerified: false
      }
    });

    // Create initial OTP
    const otpCode = generateOTP();
    await prisma.oTPToken.create({
      data: {
        email,
        otp: otpCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. OTP verification sent to email.',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        isOtpVerified: false,
        sampleOtp: otpCode // Provided in response for easy test & demo verification
      }
    });
  } catch (err) {
    next(err);
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: { message: 'Email is required.' } });
    }

    const otpCode = generateOTP();
    await prisma.oTPToken.create({
      data: {
        email,
        otp: otpCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}.`,
      sampleOtp: otpCode
    });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and OTP code are required.' }
      });
    }

    const record = await prisma.oTPToken.findFirst({
      where: {
        email,
        otp,
        isUsed: false,
        expiresAt: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or expired OTP code. Please request a new verification code.' }
      });
    }

    // Mark OTP used
    await prisma.oTPToken.update({
      where: { id: record.id },
      data: { isUsed: true }
    });

    // Mark user verified
    const user = await prisma.user.update({
      where: { email },
      data: { isOtpVerified: true }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
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
        error: { message: 'Email and password are required.' }
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
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
          isOtpVerified: user.isOtpVerified
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
