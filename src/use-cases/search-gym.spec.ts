import { expect, describe, it, beforeEach} from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "./search-gyms";

let gymsInMemoryRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyms Use Case", () => {
    beforeEach(async () => {
        gymsInMemoryRepository = new InMemoryGymsRepository();        
        sut = new SearchGymUseCase(gymsInMemoryRepository);            
    });    

    it("should be able to search for gyms", async () => {                        
        await gymsInMemoryRepository.create({
            title: "Javascript academia",
            description: "Academia focada no bem estar",
            phone: "91234566640",
            latitue: -18.8867462,
            longitude: -41.9494066
        });

        await gymsInMemoryRepository.create({
           title: "Typescript academia",
           description: "Academia focada no bem estar",
           phone: "91234566640",
           latitue: -18.8867462,
           longitude: -41.9494066
        });
        
        const { gyms } = await sut.execute({                        
            query: "Javascript",
            page: 1           
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript academia"}),            
        ]);
    });

    it("should be able to fetch paginated gyms search", async () => {                        
        for(let i = 1; i <= 22; i++) {
            await gymsInMemoryRepository.create({
                title: `Javascript academia ${i}`,
                description: "Academia focada no bem estar",
                phone: "91234566640",
                latitue: -18.8867462,
                longitude: -41.9494066
            });    
        }                
        
        const { gyms } = await sut.execute({                        
            query: 'Javascript',    
            page: 2        
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript academia 21"}),
            expect.objectContaining({ title: "Javascript academia 22"}),
        ]);
    });
});


