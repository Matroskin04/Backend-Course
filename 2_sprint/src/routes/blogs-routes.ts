import {Router, Response} from "express";
import {validateBodyOfBlog} from "../middlewares/validation-middlewares/blogs-validation-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {ViewBlogModel, ViewAllBlogsModel, ViewPostsOfBlogModel} from "../models/BlogsModels/ViewBlogModel";
import {UriBlogIdModel} from "../models/BlogsModels/UriBlogModel";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";
import {getErrors} from "../middlewares/validation-middlewares/validation-middlewares";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {PostTypeWithId} from "../repositories/repositories-types/posts-types-repositories";
import {CreatePostByBlogIdModel} from "../models/PostsModels/CreatePostModel";
import {checkErrorsPostByBlogId} from "../middlewares/validation-middlewares/posts-validation-middlewares";
import {authorization} from "../middlewares/authorization-middelwares";
import {UriIdModel} from "../models/UriModels";
import {QueryBlogModel} from "../models/BlogsModels/QueryBlogModel";
import {postsQueryRepository} from "../queryRepository/posts-query-repository";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";

export const blogsRoutes = Router();


blogsRoutes.get('/', async (req: RequestWithQuery<QueryBlogModel>,
                            res: Response<ViewAllBlogsModel>) => {

    const result = await blogsQueryRepository.getAllBlogs(req.query);
    res.status(200).send(result);
})

blogsRoutes.get('/:id', validateFormatOfUrlParams, async (req: RequestWithParams<UriIdModel>,
                               res: Response<ViewBlogModel>) => {

    const result = await blogsQueryRepository.getSingleBlog(req.params.id);
    result ? res.status(200).send(result)
        : res.sendStatus(404);
})

blogsRoutes.get('/:blogId/posts', validateFormatOfUrlParams, async (req: RequestWithParamsAndQuery<UriBlogIdModel, QueryBlogModel>,
                                         res: Response<ViewPostsOfBlogModel>) => {

    const result = await postsQueryRepository.getPostsOfBlog(req.params.blogId, req.query)
    result ? res.status(200).send(result)
        : res.sendStatus(404);
})

blogsRoutes.post('/', authorization, validateBodyOfBlog, getErrors, async (req: RequestWithBody<CreateBlogModel>,
                                                                           res: Response<ViewBlogModel>) => {

    const result = await blogsService.createBlog(req.body);
    res.status(201).send(result);
})

blogsRoutes.post('/:blogId/posts', validateFormatOfUrlParams, authorization, checkErrorsPostByBlogId, getErrors,
    async (req: RequestWithParamsAndBody<UriBlogIdModel, CreatePostByBlogIdModel>,
           res: Response<PostTypeWithId>) => {

    const result = await blogsService.createPostByBlogId(req.params.blogId, req.body);
    result ? res.status(201).send(result)
        : res.sendStatus(404);
})

blogsRoutes.put('/:id', validateFormatOfUrlParams, authorization, validateBodyOfBlog, getErrors,
    async (req: RequestWithParamsAndBody<UriIdModel, UpdateBlogModel>,
           res: Response<void>) => {

    const result = await blogsService.updateBlog(req.body, req.params.id);

    result ? res.sendStatus(204)
            : res.sendStatus(404);
})
blogsRoutes.delete('/:id', validateFormatOfUrlParams, authorization, async (req: RequestWithParams<UriIdModel>,
                                                 res: Response<void>) => {

    const result = await blogsService.deleteSingleBlog(req.params.id);
    if (result) {
        return res.sendStatus(204);

    } else {
        return res.sendStatus(404);
    }
})
