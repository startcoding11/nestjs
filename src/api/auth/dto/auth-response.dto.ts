import { UserRole } from '@/shared/enums';

export class UserResponseDto {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;

  // Profile based on role
  customerProfile?: {
    loyaltyPoints: number;
    totalSpent: number;
  };
  workerProfile?: {
    employeeId?: string;
    department?: string;
  };
}

export class AuthResponseDto {
  user: UserResponseDto;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}