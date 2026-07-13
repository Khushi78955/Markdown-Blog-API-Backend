import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {

    test("GET / should return API running message", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message)
            .toBe("Markdown Blog API is running");
    });


    test("POST /auth/register should create a new user", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: `test${Date.now()}@gmail.com`,
                password: "password123"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toContain("@gmail.com");
    });


    test("POST /auth/login should login a user", async () => {
        const email = `login${Date.now()}@gmail.com`;
        await request(app)
            .post("/auth/register")
            .send({
                name: "Login User",
                email,
                password: "password123"
            });
        const response = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: "password123"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.accessToken).toBeDefined();
    });


    test("POST /auth/register should fail for duplicate email", async () => {
        const email = `duplicate${Date.now()}@gmail.com`;
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email,
                password: "password123"
            });
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Another User",
                email,
                password: "password123"
            });
        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
    });



    test("POST /auth/login should fail with incorrect password", async () => {
        const email = `wrongpass${Date.now()}@gmail.com`;
        await request(app)
            .post("/auth/register")
            .send({
                name: "Wrong Password User",
                email,
                password: "password123"
            });
        const response = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: "wrongpassword"
            });
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("POST /posts should fail without an access token", async () => {
        const response = await request(app)
                .post("/posts")
                .send({
                    title: "Protected Post",
                    markdownBody: "# Hello\n\nThis is a protected post."
                });
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });
});


