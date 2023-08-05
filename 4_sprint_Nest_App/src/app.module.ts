import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlogsService } from './features/blogs/application/blogs-service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/query.repository/blogs-query-repository';
import { BlogsRepository } from './features/blogs/infrastructure/repository/blogs-repository';
import { Blog, BlogSchema } from './features/blogs/domain/blogs-schema-model';
import { BlogsController } from './features/blogs/api/blogs.controller';
import {
  LikesInfo,
  LikesInfoSchema,
  Post,
  PostSchema,
} from './features/posts/domain/posts-schema-model';
import {
  Comment,
  CommentatorInfo,
  CommentatorInfoSchema,
  CommentSchema,
} from './features/comments/domain/comments-schema-model';
import { PostsController } from './features/posts/api/posts-controller';
import { PostsService } from './features/posts/application/posts-service';
import { PostsQueryRepository } from './features/posts/infrastructure/query.repository/posts-query-repository';
import { PostsRepository } from './features/posts/infrastructure/repository/posts-repository';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
  PasswordRecovery,
  PasswordRecoverySchema,
  User,
  UserSchema,
} from './features/users/domain/users-schema-model';
import { CommentsController } from './features/comments/api/comments-controller';
import { UsersController } from './features/users/api/users-controller';
import { CommentsQueryRepository } from './features/comments/infrastructure/query.repository/comments-query-repository';
import { UsersService } from './features/users/application/users-service';
import { UsersRepository } from './features/users/infrastructure/repository/users-repository';
import { UsersQueryRepository } from './features/users/infrastructure/query.repository/users-query-repository';
import { TestingController } from './features/test.delete/testing-controller';
import { TestingRepository } from './features/test.delete/testing-repository';
import { LocalStrategy } from './features/auth/strategy/local.strategy';
import { AuthService } from './features/auth/service/auth-service';
import { CryptoAdapter } from './adapters/crypto-adapter';
import { EmailManager } from './managers/email-manager';
import { EmailAdapter } from './adapters/email-adapter';
import { AuthController } from './features/auth/auth-controller';
import { JwtRefreshStrategy } from './features/auth/strategy/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './features/jwt/jwt-service';
import { JwtQueryRepository } from './features/jwt/jwt-query-repository';
import { JwtAccessGuard } from './features/auth/guards/jwt-access.guard';
import { JwtAccessStrategy } from './features/auth/strategy/jwt-access.strategy';
import { BasicStrategy } from './features/auth/strategy/basic.strategy';
import {
  CommentLikesInfo,
  CommentsLikesInfoSchema,
  PostLikesInfo,
  PostsLikesInfoSchema,
} from './features/likes.info/likes-info-schema-model';
import { LikesInfoService } from './features/likes.info/likes-info-service';
import { LikesInfoQueryRepository } from './features/likes.info/likes-info-query-repository';
import { LikesInfoRepository } from './features/likes.info/likes-info-repository';
import { CommentsService } from './features/comments/application/comments-service';
import { CommentsRepository } from './features/comments/infrastructure/repository/comments-repository';
import { IsBlogByIdExistsConstraint } from './features/posts/decorators/blog-id-exists.decorator';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DevicesController } from './features/devices/devices-controller';
import { DevicesService } from './features/devices/devices-service';
import { DevicesQueryRepository } from './features/devices/devices-query-repository';
import { DevicesRepository } from './features/devices/devices-repository';
import { Device, DeviceSchema } from './features/devices/devices-schema-model';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: LikesInfo.name, //todo вложенные схемы тоже здесь указывать?
        schema: LikesInfoSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: CommentatorInfo.name,
        schema: CommentatorInfoSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: EmailConfirmation.name,
        schema: EmailConfirmationSchema,
      },
      {
        name: PasswordRecovery.name,
        schema: PasswordRecoverySchema,
      },
      {
        name: CommentLikesInfo.name,
        schema: CommentsLikesInfoSchema,
      },
      {
        name: PostLikesInfo.name,
        schema: PostsLikesInfoSchema,
      },
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
    JwtModule.register({
      //todo как сделать разные?
      secret: process.env.PRIVATE_KEY_ACCESS_TOKEN,
      signOptions: { expiresIn: process.env.EXPIRATION_TIME_ACCESS_TOKEN },
    }),
  ],
  controllers: [
    AuthController,
    BlogsController,
    DevicesController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
  ],
  providers: [
    AuthService,
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    CommentsService,
    CommentsQueryRepository,
    CommentsRepository,
    DevicesService,
    DevicesQueryRepository,
    DevicesRepository,
    LikesInfoService,
    LikesInfoQueryRepository,
    LikesInfoRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    JwtService,
    JwtQueryRepository,
    TestingRepository,
    IsBlogByIdExistsConstraint,
    //Strategy
    LocalStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    BasicStrategy,

    //Managers && Adapters
    EmailManager,
    CryptoAdapter,
    EmailAdapter,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
