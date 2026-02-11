
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/core/entities/mysql/user.entity';
import { UserRole } from '@/shared/enums';

export class UserResponseDto {
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

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.avatarUrl = user.avatarUrl;
    this.role = user.role;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.fullName = user.fullName;
  }
}