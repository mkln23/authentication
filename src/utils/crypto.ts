import { compare, hash } from 'bcrypt';

import { validatedEnv } from '@/configs/env';

export const generatehash = async (str: string) => await hash(str, validatedEnv.SALT_ROUNDS);

export const compareHash = async (str: string, hashStr: string) => await compare(str, hashStr);
