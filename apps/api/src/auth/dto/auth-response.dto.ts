import { User } from '@trust-travel/shared';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: Partial<User>;
}
