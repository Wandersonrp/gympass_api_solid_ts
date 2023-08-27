import request from 'supertest';
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe("Nearby Gyms (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to fetch nearby gyms", async () => {
        const { token } = await createAndAuthenticateUser(app);       

        await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Typescript Gym",
            description: "...",
            phone: "",
            latitude: -18.8867462,
            longitude: -41.9494066
        });

        await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Javascript Gym",
            description: "...",
            phone: "",
            latitude: -19.1561305,
           longitude: -42.2396658
        });
            
        const response = await request(app.server)
        .get("/gyms/nearby")
        .query({
            latitude: -18.8867462,    
            longitude: -41.9494066       
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