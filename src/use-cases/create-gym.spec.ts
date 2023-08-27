import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

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
            latitude: -18.8867462,
            longitude: -41.9494066
        });


        expect(gym.id).toEqual(expect.any(String));
    });    
});

