import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: error.format()});
    }

    if(env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: here we should log to an external tool like datadog
    }

    return reply.status(500).send({ message: "Iternal server error"});
});
