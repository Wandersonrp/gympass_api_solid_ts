import request from 'supertest';
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe("Search Gyms (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to fetch gyms", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gym = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Typescript Gym",
            description: "...",
            phone: "",
            latitude: -18.8909487,
            longitude: -41.8841753
        });
            
        const response = await request(app.server)
        .get("/gyms/search")
        .query({
            q: "Typescript",            
        })
        .set("Authorization", `Bearer ${token}`)
        .send();                

        expect(response.statusCode).toBe(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "Typescript Gym"
            })
        ]);
    });
});