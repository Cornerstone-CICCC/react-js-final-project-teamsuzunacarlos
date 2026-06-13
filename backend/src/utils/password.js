import bcrypt from 'bcryptjs';
import zxcvbn from 'zxcvbn';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const validatePasswordStrength = (password) => {
  const result = zxcvbn(password);
  return {
    score: result.score,
    feedback: result.feedback.suggestions,
    isStrong: result.score >= 2,
  };
};
