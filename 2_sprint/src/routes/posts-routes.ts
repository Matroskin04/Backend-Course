import {Router, Response} from "express";
import {authorization} from "../middlewares/authorization-middelwares";
import {validateBodyOfPost} from "../middlewares/posts-validation-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {ViewPostModel, ViewAllPostsModel} from "../models/PostsModels/ViewPostModel";
import {UpdatePostModel} from "../models/PostsModels/UpdatePostModel";
import {getErrors} from "../middlewares/validation-middlewares";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../queryRepository/posts-query-repository";
import {UriIdModel} from "../models/UriModels";
import {checkToken} from "../middlewares/auth-validation-middlewares";
import {validateBodyOfComment} from "../middlewares/comments-validation-middlewares";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {QueryPostModel} from "../models/PostsModels/QueryPostModel";
import {ViewAllCommentsOfPostModel, ViewCommentOfPostModel} from "../models/PostsModels/ViewCommentsOfPostModel";

export const postsRoutes = Router();


postsRoutes.get('/', async (req: RequestWithQuery<QueryPostModel>,
                            res: Response<ViewAllPostsModel>) => {

    const result = await postsQueryRepository.getAllPosts(req.query);
    res.status(200).send(result);
});
postsRoutes.get('/:id', async (req: RequestWithParams<UriIdModel>,
                               res: Response<ViewPostModel>) => {

    const result = await postsQueryRepository.getSinglePost(req.params.id)

    result ? res.status(200).send(result)
        : res.sendStatus(404)
});
postsRoutes.get('/:id/comments', async (req:RequestWithParamsAndQuery<UriIdModel, QueryPostModel>,
                                        res: Response<ViewAllCommentsOfPostModel>) => {

    const result = await postsQueryRepository.getCommentOfPost(req.query, req.params.id);
    result ? res.status(200).send(result)
        : res.sendStatus(404)
})
postsRoutes.post('/', authorization, validateBodyOfPost, getErrors,
    async (req: RequestWithBody<CreatePostModel>,
           res: Response<ViewPostModel | ViewAllErrorsModels>) => {

        const result = await postsService.createPost(req.body)
        res.status(201).send(result)

});
postsRoutes.post('/:id/comments', checkToken, validateBodyOfComment, getErrors,
    async (req: RequestWithParamsAndBody<UriIdModel, CreateCommentByPostIdModel>,
           res: Response<ViewCommentOfPostModel | ViewAllErrorsModels>) => {

    const result = await postsService.createCommentByPostId(req.body, req.userId!, req.params.id);
    result ? res.status(201).send(result)
        : res.sendStatus(404)
});
postsRoutes.put('/:id', authorization, validateBodyOfPost, getErrors,
    async (req: RequestWithParamsAndBody<UriIdModel, UpdatePostModel>,
           res: Response<ViewAllErrorsModels>) => {

        const result = await postsService.updatePost(req.body, req.params.id);
        result ? res.sendStatus(204)
            : res.sendStatus(404);
});
postsRoutes.delete('/:id', authorization, async (req: RequestWithParams<UriIdModel>,
                                                 res: Response) => {

    const result = await postsService.deleteSinglePost(req.params.id);
    result ? res.sendStatus(204)
        : res.sendStatus(404);
});



