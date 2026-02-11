import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus, NotFoundException, Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDomainService } from '@/domain/user/services/user.domain.service';
import { AuthGuard } from '@/core/auth/guards/auth.guard';
import { RolesGuard } from '@/core/auth/guards/roles.guard';
import { Roles } from '@/core/auth/decorators/roles.decorator';
import { CurrentUser } from '@/core/auth/decorators/current-user.decorator';
import { UserRole } from '@/shared/enums';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { USER_DOMAIN_SERVICE } from '@/shared/constants/service.constants';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(@Inject(USER_DOMAIN_SERVICE) private readonly userService: UserDomainService) {
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: UserResponseDto })
  async getProfile(@CurrentUser() userId: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(userId);
    return new UserResponseDto(user);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return new UserResponseDto(user);
  }

  @Get('email/:email')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get user by email (admin only)' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  async getUserByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(email);
    return new UserResponseDto(user);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all active users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved', type: [UserResponseDto] })
  async getAllActiveUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAllActive();
    return users.map(user => new UserResponseDto(user));
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @CurrentUser() userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateProfile(userId, dto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  @Put(':id/role')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Change user role (owner only)' })
  @ApiResponse({ status: 200, description: 'Role changed', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changeRole(
    @Param('id') userId: string,
    @Body('role') role: UserRole,
  ): Promise<UserResponseDto> {
    const user = await this.userService.changeRole(userId, role);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate user (admin only)' })
  @ApiResponse({ status: 204, description: 'User deactivated' })
  async deactivateUser(@Param('id') userId: string): Promise<void> {
    await this.userService.deactivateUser(userId);
  }

  @Put(':id/activate')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Activate user (admin only)' })
  @ApiResponse({ status: 200, description: 'User activated', type: UserResponseDto })
  async activateUser(@Param('id') userId: string): Promise<UserResponseDto> {
    const user = await this.userService.activateUser(userId);
    return new UserResponseDto(user);
  }

  @Get('stats/customer')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get customer stats (admin only)' })
  @ApiResponse({ status: 200, description: 'Stats retrieved' })
  async getCustomerStats() {
    return this.userService.getStats();
  }
}