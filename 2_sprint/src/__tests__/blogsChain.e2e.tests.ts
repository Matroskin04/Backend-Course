import {describe} from "node:test";
import {blogsCollection, client} from "../db";
import request from "supertest";
import {app} from "../setting";
import {BlogTypeWithId} from "../repositories/repositories-types/blogs-types-repositories";

let idOfBlog: string;
const arrayOfBlogs: Array<BlogTypeWithId | null> = [];

describe('Blogs All operation, chains: /blogs', () => {

    beforeAll(async () => {
        await client.close();
        await client.connect();

        await request(app)
            .delete('/hometask-02/testing/all-data')
            .expect(204)
    });

    afterAll(async () => {
        await client.close();
    })

    it(`+ POST -> "/blogs": should create new blog; status 201;
                GET -> /blogs/:id;`, async () => {

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: "Blog12-Dim",
                description: "Some description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toEqual('Blog12-Dim');
        await request(app)
            .get(`/hometask-02/blogs/${response.body.id}`)
            .expect(200)

        idOfBlog = response.body.id;
    });

    it(`+ POST -> "/blogs/:blogId/posts": should create new post for specific blog; status 201;
          POST -> /blogs, GET -> /posts/:id;`, async () => {

        const response = await request(app)
            .post(`/hometask-02/blogs/${idOfBlog}/posts`)
            .auth('admin', 'qwerty')
            .send({
                title: "postForBlog1",
                shortDescription: "something",
                content: "hello",
                blogId: idOfBlog
            })

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: expect.any(String),
            title: "postForBlog1",
            shortDescription: "something",
            content: "hello",
            blogId: idOfBlog,
            blogName: "Blog12-Dim",
            createdAt: expect.any(String)
        })
    });

    it(`- POST -> "/blogs/:blogId/posts": should NOT create new post; status 400`, async () => {

        await request(app)
            .post(`/hometask-02/blogs/${idOfBlog}/posts`)
            .auth('admin', 'qwerty')
            .send({
                title: "Too much symbols. 123456712345671234",
                shortDescription: "something",
                content: "hello",
                blogId: idOfBlog
            })
            .expect(400)
    });

    it(`- DELETE -> "/blogs/:blogId" - should delete blog;
                POST -> "/blogs/:blogId/posts": should NOT create new post; status 404`, async () => {

        await request(app).delete(`/hometask-02/blogs/${idOfBlog}`).auth('admin', 'qwerty').expect(204)
        await request(app)
            .post(`/hometask-02/blogs/${idOfBlog}/posts`)
            .auth('admin', 'qwerty')
            .send({
                title: "postForBlog1",
                shortDescription: "something",
                content: "hello",
                blogId: idOfBlog
            })
            .expect(404)
    })

    it (`+ POST -> "/blogs" -  should create blog;
                 PUT -> "/blogs/:id": should update blog by id; status 204;
                 GET -> /blogs/:id`, async () => {

        const responsePost = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send({
            name: "Blog2-ITforYOU",
            description: "some information",
            websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            })
            .expect(201)

        await request(app)
            .put(`/hometask-02/blogs/${responsePost.body.id}`)
            .auth('admin', 'qwerty')
            .send({
                name: "ChangedName",
                description: "ChangedDescription",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            })

        const responseGet = await request(app).get(`/hometask-02/blogs/${responsePost.body.id}`).expect(200)

        expect(responseGet.body.name).toEqual('ChangedName')
        expect(responseGet.body.id).toEqual(responsePost.body.id)
        idOfBlog = responsePost.body.id;
    })

    it (`- PUT -> "/blogs/:id": Unauthorized; status 401`, async () => {

        await request(app)
            .put(`/hometask-02/blogs/${idOfBlog}`)
            .send({
                name: "ChangedName",
                description: "ChangedDescription",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            })
            .expect(401)
    })

    it(`- PUT -> "/blogs/:id": inputModel has incorrect values; status 400`, async () => {

        await request(app)
            .put(`/hometask-02/blogs/${idOfBlog}`)
            .auth('admin', 'qwerty')
            .send({
                name: "The name is too long: 123456123456",
                description: "ChangedDescription",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            })
            .expect(400)
    })

    describe(`QUERY-PAGINATION -> "/"`, () => {

        it(`+DELETE ALL DATA,
                 +POST: create 4 new blogs`, async() => {

            await request(app)
                .delete('/hometask-02/testing/all-data')
                .expect(204)

            //1 blog
            const blogInputData1 = {
                name: "Alex-blog",
                description: "Alex-description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            };

            const response1 = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(blogInputData1);

            expect(response1.status).toBe(201);
            arrayOfBlogs.push(response1.body);

            //2 blog
            const blogInputData2 = {
                name: "Bob-blog",
                description: "Bob-description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            };

            const response2 = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(blogInputData2);

            expect(response2.status).toBe(201);
            arrayOfBlogs.push(response2.body);

            //3 blog
            const blogInputData3 = {
                name: "Danil-blog",
                description: "Danil-description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            };

            const response3 = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(blogInputData3);

            expect(response3.status).toBe(201);
            arrayOfBlogs.push(response3.body);

            //4 blog
            const blogInputData4 = {
                name: "Fiona-blog",
                description: "Fiona-description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            };

            const response4 = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(blogInputData4);

            expect(response4.status).toBe(201);
            arrayOfBlogs.push(response4.body);

            const allBlogs = await blogsCollection.find().toArray()
            expect(allBlogs.length).toBe(4)
        })

        it(`Pagination-GET: pageNumber=2 + pageSize=2`, async () => {

            const result = await request(app)
                .get(`/hometask-02/blogs`)
                .query(`pageNumber=2&pageSize=2`)

            expect(result.body.items).toEqual([arrayOfBlogs[1],arrayOfBlogs[0]]);
            expect(result.body.pagesCount).toEqual(2);
            expect(result.body.page).toEqual(2);
            expect(result.body.pageSize).toEqual(2);
            expect(result.body.totalCount).toEqual(4);
        })
    })
})