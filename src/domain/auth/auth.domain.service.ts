// src/domain/auth/services/auth.domain.service.ts
import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@/shared/constants/repositories.constants';
import { CUSTOMER_PROFILE_REPOSITORY } from '@/shared/constants/repositories.constants';
import { WORKER_PROFILE_REPOSITORY } from '@/shared/constants/repositories.constants';
import { UserRepository } from '@/domain/user/repositories/user.repository';
import { CustomerProfileRepository } from '@/domain/user/repositories/customer-profile.repository';
import { WorkerProfileRepository } from '@/domain/user/repositories/worker-profile.repository';
import { UserRole } from '@/shared/enums';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { RegisterDto, LoginDto, AuthResponseDto, AuthUserResponseDto } from '@/api/auth/dto';
import { UserEntity } from '@/core/entities/mysql/user.entity';
import { RecipeUserId, User } from 'supertokens-node';
import { SessionContainerInterface } from 'supertokens-node/lib/build/recipe/session/types';

@Injectable()
export class AuthDomainService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(CUSTOMER_PROFILE_REPOSITORY) private readonly customerProfileRepository: CustomerProfileRepository,
    @Inject(WORKER_PROFILE_REPOSITORY) private readonly workerProfileRepository: WorkerProfileRepository,
  ) {
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Check if user exists in local DB
    const existingUser: UserEntity | null = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // 2. Create user in Supertokens
    const signUpResponse = await EmailPassword.signUp('public', dto.email, dto.password);

    if (signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      throw new BadRequestException('User with this email already exists');
    }

    const supertokensUser: User = signUpResponse.user;

    // 3. Determine role (default to CUSTOMER)
    const role: UserRole = dto.role || UserRole.CUSTOMER;

    // 4. Create local user
    const user: UserEntity = await this.userRepository.create({
      supertokensUserId: supertokensUser.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role,
      emailVerified: false,
      isActive: true,
    });

    // 5. Create profile based on role
    if (role === UserRole.CUSTOMER) {
      await this.customerProfileRepository.create({
        userId: user.id,
        loyaltyPoints: 0,
        totalSpent: 0,
      });
    } else {
      // For SELLER, MANAGER, OWNER
      await this.workerProfileRepository.create({
        userId: user.id,
      });
    }

    const recipeUserId = new RecipeUserId(supertokensUser.id);

    const session: SessionContainerInterface = await Session.createNewSessionWithoutRequestResponse(
      'public',
      recipeUserId,
    );

    // 7. Return formatted response
    return this.buildAuthResponse(user, session);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Authenticate with Supertokens
    const response = await EmailPassword.signIn('public', dto.email, dto.password);

    if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const supertokensUser: User = response.user;

    // 2. Get local user
    const user: UserEntity | null = await this.userRepository.findBySupertokensId(supertokensUser.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const recipeUserId = new RecipeUserId(supertokensUser.id);

    const session: SessionContainerInterface = await Session.createNewSessionWithoutRequestResponse(
      'public',
      recipeUserId,
    );

    // 4. Return formatted response
    return this.buildAuthResponse(user, session);
  }

  async getCurrentUser(supertokensUserId: string): Promise<AuthUserResponseDto> {
    const user: UserEntity | null = await this.userRepository.findBySupertokensId(supertokensUserId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.buildUserResponse(user);
  }

  async logout(sessionHandle: string): Promise<void> {
    await Session.revokeSession(sessionHandle);
  }

  async refreshSession(refreshToken: string): Promise<{ accessToken: string }> {
    const session: SessionContainerInterface = await Session.refreshSessionWithoutRequestResponse(refreshToken);
    return {
      accessToken: session.getAccessToken(),
    };
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async buildAuthResponse(user: any, session: any): Promise<AuthResponseDto> {
    return {
      user: await this.buildUserResponse(user),
      session: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: session.expiry,
      },
    };
  }

  private async buildUserResponse(user: any): Promise<AuthUserResponseDto> {
    const response: AuthUserResponseDto = {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      fullName: user.fullName,
    };

    if (user.role === UserRole.CUSTOMER) {
      const profile = await this.customerProfileRepository.findByUserId(user.id);
      if (profile) {
        response.customerProfile = {
          loyaltyPoints: profile.loyaltyPoints,
          totalSpent: profile.totalSpent,
        };
      }
    } else {
      const profile = await this.workerProfileRepository.findByUserId(user.id);
      if (profile) {
        response.workerProfile = {
          employeeId: profile.employeeId,
          department: profile.department,
        };
      }
    }

    return response;
  }
}