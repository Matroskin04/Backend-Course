import "reflect-metadata";
import {PostsRepository} from "./infrastructure/repositories/posts-repository";
import {BlogsRepository} from "./infrastructure/repositories/blogs-repository";
import {BlogsQueryRepository} from "./infrastructure/queryRepository/blogs-query-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsQueryRepository} from "./infrastructure/queryRepository/posts-query-repository";
import {PostsService} from "./domain/posts-service";
import {BlogsController} from "./api/controllers/blogs-controller";
import {PostsController} from "./api/controllers/posts-controller";
import {DevicesRepository} from "./infrastructure/repositories/devices-repository";
import {DevicesQueryRepository} from "./infrastructure/queryRepository/devices-query-repository";
import {DevicesService} from "./domain/devices-service";
import {DevicesController} from "./api/controllers/devices-controller";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./api/controllers/auth-controller";
import {CommentsRepository} from "./infrastructure/repositories/comments-repository";
import {CommentsQueryRepository} from "./infrastructure/queryRepository/comments-query-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./api/controllers/comments-controller";
import {JwtQueryRepository} from "./infrastructure/queryRepository/jwt-query-repository";
import {JwtService} from "./domain/jwt-service";
import {TestingRepository} from "./infrastructure/repositories/testing-repository";
import {TestingController} from "./api/controllers/testing-controller";
import {UsersRepository} from "./infrastructure/repositories/users-repository";
import {UsersQueryRepository} from "./infrastructure/queryRepository/users-query-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./api/controllers/users-controller";
import {LikesInfoQueryRepository} from "./infrastructure/queryRepository/likes-info-query-repository";
import {LikesInfoService} from "./domain/likes-info-service";
import {LikesInfoRepository} from "./infrastructure/repositories/likes-info-repository";
import { Container } from "inversify";
import {EmailAdapter} from "./infrastructure/adapters/email-adapter";
import {EmailManager} from "./managers/email-manager";


export const container = new Container();
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsController).to(BlogsController);

container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsService).to(PostsService);
container.bind(PostsController).to(PostsController);

container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsController).to(CommentsController);

container.bind(DevicesRepository).to(DevicesRepository);
container.bind(DevicesQueryRepository).to(DevicesQueryRepository);
container.bind(DevicesService).to(DevicesService);
container.bind(DevicesController).to(DevicesController);

container.bind(JwtQueryRepository).to(JwtQueryRepository);
container.bind(JwtService).to(JwtService);

container.bind(LikesInfoQueryRepository).to(LikesInfoQueryRepository);
container.bind(LikesInfoRepository).to(LikesInfoRepository);
container.bind(LikesInfoService).to(LikesInfoService);

container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersService).to(UsersService);
container.bind(UsersController).to(UsersController);

container.bind(TestingRepository).to(TestingRepository);
container.bind(TestingController).to(TestingController);

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

container.bind(EmailAdapter).to(EmailAdapter);
container.bind(EmailManager).to(EmailManager);