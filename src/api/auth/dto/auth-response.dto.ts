// src/api/auth/dto/auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/shared/enums';

export class AuthUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  fullName?: string;

  // Profile data based on role (specific to auth response)
  @ApiProperty({ required: false })
  customerProfile?: {
    loyaltyPoints: number;
    totalSpent: number;
  };

  @ApiProperty({ required: false })
  workerProfile?: {
    employeeId?: string;
    department?: string;
  };

  // Constructor if needed
  constructor(partial: Partial<AuthUserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class SessionDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class AuthResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user: AuthUserResponseDto;

  @ApiProperty({ type: SessionDto })
  session: SessionDto;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}