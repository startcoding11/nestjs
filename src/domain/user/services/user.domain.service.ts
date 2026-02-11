import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { UserRole } from '@/shared/enums';
import { UpdateUserDto } from '@/api/user/dto/update-user.dto';
import { UserRepository } from '@/domain/user/repositories/user.repository';
import { CustomerProfileRepository } from '@/domain/user/repositories/customer-profile.repository';
import { WorkerProfileRepository } from '@/domain/user/repositories/worker-profile.repository';
import {
  CUSTOMER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
  WORKER_PROFILE_REPOSITORY,
} from '@/shared/constants/repositories.constants';

@Injectable()
export class UserDomainService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(CUSTOMER_PROFILE_REPOSITORY) private readonly customerProfileRepository: CustomerProfileRepository,
    @Inject(WORKER_PROFILE_REPOSITORY) private readonly workerProfileRepository: WorkerProfileRepository,
  ) {
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAllActive() {
    return this.userRepository.findActiveUsers();
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.update(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      avatarUrl: dto.avatarUrl,
    });

    return updatedUser;
  }

  async changeRole(userId: string, newRole: UserRole) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === newRole) {
      throw new BadRequestException(`User already has role ${newRole}`);
    }

    // If changing to/from customer, handle profile creation/deletion
    if (user.role === UserRole.CUSTOMER && newRole !== UserRole.CUSTOMER) {
      // Remove customer profile, create worker profile
      await this.customerProfileRepository.softDelete(userId);
      await this.workerProfileRepository.create({ userId });
    } else if (user.role !== UserRole.CUSTOMER && newRole === UserRole.CUSTOMER) {
      // Remove worker profile, create customer profile
      await this.workerProfileRepository.softDelete(userId);
      await this.customerProfileRepository.create({
        userId,
        loyaltyPoints: 0,
        totalSpent: 0,
      });
    }

    const updatedUser = await this.userRepository.update(userId, { role: newRole });
    return updatedUser;
  }

  async deactivateUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softDelete(userId);
    return { message: 'User deactivated successfully' };
  }

  async activateUser(userId: string) {
    // This would require a custom method to restore soft-deleted user
    // For now, just update isActive flag
    const user = await this.userRepository.update(userId, { isActive: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getStats() {
    return this.userRepository.getCustomerStats();
  }
}