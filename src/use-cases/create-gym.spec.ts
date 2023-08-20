import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCases } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { Prisma } from "@prisma/client";

let gymsInMemoryRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
    beforeEach(() => {
        gymsInMemoryRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsInMemoryRepository);
    });

    it("should be able to register", async () => {
        const { gym } = await sut.execute({
            title: "Academia Top Healthy",
            description: "Academia focada no bem estar",
            phone: "91234566640",
            latitue: -18.8867462,
            longitude: -41.9494066
        });


        expect(gym.id).toEqual(expect.any(String));
    });    
});

