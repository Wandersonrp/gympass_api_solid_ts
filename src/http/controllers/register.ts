import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { RegisterUseCases } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password} = registerBodySchema.parse(request.body);

    try {
        const registerUseCases = makeRegisterUseCase();

        await registerUseCases.execute({
            name,
            email, 
            password
        });
    } catch (error) {
        if(error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message });
        }

        throw error;
     }    

    return reply.status(201).send();
}