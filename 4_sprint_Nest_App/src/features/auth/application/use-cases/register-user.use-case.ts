import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { CryptoAdapter } from '../../../../infrastructure/adapters/crypto.adapter';
import { UsersSARepository } from '../../../users/super-admin/infrastructure/repository/users-sa.repository';
import { EmailManager } from '../../../../infrastructure/managers/email-manager';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../users/super-admin/domain/users.entity';
import { UserModelType } from '../../../users/super-admin/domain/users.db.types';

export class RegisterUserCommand {
  constructor(
    public email: string,
    public login: string,
    public password: string,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected cryptoAdapter: CryptoAdapter,
    protected emailManager: EmailManager,
    protected usersRepository: UsersSARepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { email, login, password } = command;

    const passwordHash = await this.cryptoAdapter._generateHash(password);
    const userInfo = {
      email,
      login,
      passwordHash,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 5, seconds: 20 }),
        isConfirmed: false,
      },
      passwordRecovery: {},
    };
    const user = this.UserModel.createInstance(userInfo, this.UserModel);
    console.log(1);
    await this.usersRepository.save(user);

    this.emailManager.sendEmailConfirmationMessage(
      user.email,
      user.emailConfirmation.confirmationCode,
    );
    return;
  }
}
