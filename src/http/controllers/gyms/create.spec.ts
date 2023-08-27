import request from 'supertest';
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe("Create Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a gym", async () => {
        const { token } = await createAndAuthenticateUser(app);   
        
        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Typescript Gym",
                description: "...",
                phone: "",
                latitude: -18.8909487, 
                longitude: -41.8841753
            });            

        expect(response.statusCode).toBe(201);        
    });
});