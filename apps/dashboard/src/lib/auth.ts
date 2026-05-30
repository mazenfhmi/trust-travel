'use server';

import { cookies } from 'next/headers';
import { User } from '@trust-travel/shared';

const AUTH_COOKIE = 'auth_token';
const USER_COOKIE = 'auth_user';

export async function setAuthCookies(accessToken: string, user: Partial<User>) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 mins
  });
  
  cookieStore.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });
}

export async function removeAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(USER_COOKIE);
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<Partial<User> | null> {
  const cookieStore = await cookies();
  const userStr = cookieStore.get(USER_COOKIE)?.value;
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
