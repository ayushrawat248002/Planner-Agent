'use server';

import User from '@/models/usermodel';
import connectDB from '../mongodb';

export default async function userCreation(formData: FormData) {
try {
await connectDB();


const email = formData.get('email');
const password = formData.get('password');

if (
  typeof email !== 'string' ||
  typeof password !== 'string' ||
  !email.trim() ||
  !password
) {
  return {
    userId: null,
    role: null,
    mssg: 'Missing credentials',
  };
}

const normalizedEmail = email.trim().toLowerCase();

const presentUser = await User.findOne({
  email: normalizedEmail,
});

if (presentUser) {
  return {
    userId: null,
    role: null,
    mssg: 'User already exists',
  };
}

const user = await User.create({
  email: normalizedEmail,
  password,
});

return {
  userId: user._id.toString(),
  role: 'user',
  mssg: null,
};


} catch (err: unknown) {



return {
  userId: null,
  role: null,
  mssg: err instanceof Error
    ? err.message
    : 'Something went wrong',
};


}
}
