import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeSearchGymUseCase } from "@/use-cases/factories/make-search-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function searchGym(request: FastifyRequest, reply: FastifyReply) {
    const searchGymSchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { q, page }
        = searchGymSchema.parse(request.query);

    const searchGymUseCase = makeSearchGymUseCase();

    const { gyms } = await searchGymUseCase.execute({
        page,
        query: q
    });

    return reply.status(200).send({
        gyms,
    });
}