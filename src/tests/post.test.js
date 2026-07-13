import request from "supertest";
import app from "../app.js";

describe("Posts API", () => {
    let accessToken;
    beforeEach(async () => {
        const email = `post${Date.now()}@gmail.com`;
        await request(app)
            .post("/auth/register")
            .send({
                name: "Post User",
                email,
                password: "password123"
            });

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: "password123"
            });
        accessToken = loginResponse.body.accessToken;
    });

    test("POST /posts should create a new post", async () => {
        const title = `Learning Jest ${Date.now()}`;
        const response = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title,
                markdownBody: "# Jest\n\nLearning backend testing.\n\n#testing #backend"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(title);
    });


    test("GET /posts should return all posts", async () => {
        await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Node",
                markdownBody: "# Node\n\nNode backend.\n\n#node"
            });
        const response = await request(app)
            .get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);

    });



    test("GET /posts/:slug should return a single post", async () => {
        const createResponse = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: `Express Guide ${Date.now()}`,
                markdownBody: "# Express\n\nExpress tutorial.\n\n#express"
            });
        const slug = createResponse.body.data.slug;
        const response = await request(app)
            .get(`/posts/${slug}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.slug).toBe(slug);
    });


    test("PUT /posts/:slug should update a post", async () => {
        const createResponse = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: `Old Title ${Date.now()}`,
                markdownBody: "# Old\n\nOld body.\n\n#old"
            });
        const slug = createResponse.body.data.slug;
        const response = await request(app)
            .put(`/posts/${slug}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: `New Title ${Date.now()}`,
                markdownBody: "# New\n\nUpdated body.\n\n#new"
            });
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toContain("New Title");

    });


    test("DELETE /posts/:slug should delete a post", async () => {
        const createResponse = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Delete Me",
                markdownBody: "# Delete\n\nDelete body.\n\n#delete"
            });
        const slug = createResponse.body.data.slug;
        const response = await request(app)
            .delete(`/posts/${slug}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
    

    test("GET /posts should search posts by title", async () => {
        await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Node Testing",
                markdownBody: "# Node\n\nLearning Node.\n\n#node"
            });
        const response = await request(app)
            .get("/posts?search=node");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });


    test("GET /posts should filter by tag", async () => {
        await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Backend Guide",
                markdownBody: "# Backend\n\nGuide.\n\n#backend"
            });
        const response = await request(app)
            .get("/posts?tag=backend");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("GET /posts should paginate posts", async () => {
        const response = await request(app)
            .get("/posts?page=1&limit=2");
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    
    test("GET /posts/:slug should return 404", async () => {
        const response = await request(app)
            .get("/posts/does-not-exist");
        expect(response.statusCode).toBe(404);
    });


});