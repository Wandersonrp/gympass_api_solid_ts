import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { searchGym } from "./search";
import { nearbyGyms } from "./nearby";
import { create } from "./create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/gyms/search", searchGym);
    app.get("/gyms/nearby", nearbyGyms);

    app.post("/gyms", { onRequest: [verifyUserRole("ADMIM")]} ,create);
}