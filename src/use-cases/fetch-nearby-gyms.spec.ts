import { expect, describe, it, beforeEach} from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsInMemoryRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
    beforeEach(async () => {
        gymsInMemoryRepository = new InMemoryGymsRepository();        
        sut = new FetchNearbyGymsUseCase(gymsInMemoryRepository);            
    });    

    it("should be able to fetch nearby gyms", async () => {                        
        await gymsInMemoryRepository.create({
            title: "Near Gym",
            description: "Academia focada no bem estar",
            phone: "91234566640",
            latitude: -18.8867462,
            longitude: -41.9494066
        });

        await gymsInMemoryRepository.create({
           title: "Far Gym",
           description: "Academia focada no bem estar",
           phone: "91234566640",
           latitude: -19.1561305,
           longitude: -42.2396658
        });
        
        const { gyms } = await sut.execute({                        
            userLatitude: -18.8676002,
            userLongitude: -41.9493979          
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Near Gym"}),            
        ]);
    });    
});


