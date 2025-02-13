import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../../entities/mysql/base.entity';

export abstract class BaseRepository<T extends BaseEntity> {

  constructor(protected readonly repository: Repository<T>) {
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    where?: FindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
  }): Promise<[T[], number]> {
    return this.repository.findAndCount({
      skip: options?.skip || 0,
      take: options?.take || 10,
      where: options?.where,
      order: options?.order,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    const updateData = data as any;
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async updateById(id: string, data: DeepPartial<T>): Promise<T | null> {
    const updateResult = await this.repository
      .createQueryBuilder()
      .update()
      .set(data as any)
      .where('id = :id', { id })
      .execute();

    return updateResult.affected ? this.findById(id) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected !== 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }
}