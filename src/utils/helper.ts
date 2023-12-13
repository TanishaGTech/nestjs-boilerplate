import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashPassword: string)=>{ 
  const match = await bcrypt.compare(password, hashPassword);
  return match
  
}
