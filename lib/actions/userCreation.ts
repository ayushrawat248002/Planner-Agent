'use server';

import User from '@/models/usermodel';
import connectDB from '../mongodb';

export default async function userCreation(formData: FormData) {
  await connectDB();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Missing credentials');
  }

  const presentUser = await User.findOne({ email });
  if (presentUser) {
    throw new Error('User already exists');
  }

  const user = await User.create({ email, password });
         console.log(user._id);
  // ✅ return minimal data
  return {
    userId: user._id,
    role: "user",
  };
}
