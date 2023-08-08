import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../domain/users.entity';
import { UserModelType } from '../../domain/users.db.types';
import { UserInstanceType } from './users.types.repositories';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async save(user: UserInstanceType): Promise<void> {
    await user.save();
    return;
  }

  async deleteSingleUser(id: string): Promise<boolean> {
    const result = await this.UserModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async updateConfirmation(id: ObjectId): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async updateCodeConfirmation(
    _id: ObjectId,
    newCode: string,
    newDate: Date,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id },
      {
        $set: {
          'emailConfirmation.confirmationCode': newCode,
          'emailConfirmation.expirationDate': newDate,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async updateCodePasswordRecovery(
    _id: ObjectId,
    newCode: string,
    newDate: Date,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id },
      {
        $set: {
          'passwordRecovery.confirmationCode': newCode,
          'passwordRecovery.expirationDate': newDate,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async updatePassword(
    newPasswordHash: string,
    _id: ObjectId,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id },
      { $set: { passwordHash: newPasswordHash } },
    );
    return result.modifiedCount === 1;
  }
}