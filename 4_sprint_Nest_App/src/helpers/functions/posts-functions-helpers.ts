import {
  NewestLikesType,
  PostViewType,
} from '../../infrastructure/repositories/repositories-types/posts-types-repositories';
import { PostDBType } from '../../posts/domain/posts-db-types';

export function renameMongoIdPost(
  post: PostDBType,
  newestLikes: NewestLikesType,
  myStatus: 'None' | 'Like' | 'Dislike',
): PostViewType {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus,
      newestLikes,
    },
  };
}

export async function mappingPostForAllDocs(
  post: PostDBType,
  // userId: ObjectId | null,
): Promise<PostViewType> {
  // const likesInfoQueryRepository = new LikesInfoQueryRepository();

  const myStatus: 'Like' | 'Dislike' | 'None' = 'None';

  // if (userId) {
  //   const likeInfo = await likesInfoQueryRepository.getLikesInfoByPostAndUser(
  //     post._id,
  //     userId,
  //   );
  //   if (likeInfo) {
  //     myStatus = likeInfo.statusLike;
  //   }
  // }

  //find last 3 Likes
  // const newestLikes = await likesInfoQueryRepository.getNewestLikesOfPost(
  //   post._id,
  // );
  // const reformedNewestLikes = reformNewestLikes(newestLikes);
  const reformedNewestLikes = [];

  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus: myStatus,
      newestLikes: reformedNewestLikes,
    },
  };
}