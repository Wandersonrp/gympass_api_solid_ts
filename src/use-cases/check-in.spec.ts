import { expect, describe, it, beforeEach, vi , afterEach} from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { Prisma } from "@prisma/client";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./error/max-distance-error";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error";

let checkInsInMemoryRepository: InMemoryCheckInsRepository;
let gymsInMemoryRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
    beforeEach(async () => {
        checkInsInMemoryRepository = new InMemoryCheckInsRepository();
        gymsInMemoryRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsInMemoryRepository, gymsInMemoryRepository);        

        await gymsInMemoryRepository.create({
            id: "gym-01",
            title: "Academia Top Healthy",
            description: "Academia focada no bem estar",
            phone: "91234566640",
            latitue: -18.8676002,
            longitude: -41.9493979
        })

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check-in", async () => {                        
        const { checkIn } = await sut.execute({                        
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.8676002,
            userLongitude: -41.9493979
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check-in twice in the same day", async () => {        
        vi.setSystemTime(new Date(2022, 0, 15, 6, 0, 6));
        
        await sut.execute({                        
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.8676002,
            userLongitude: -41.9493979
        });                

        // const { checkIn } = await sut.execute({                        
        //     userId: 'user-01',
        //     gymId: 'gym-01',
        //     userLatitude: -18.8676002,
        //     userLongitude: -41.9493979
        // })
        
        await expect(() => 
            sut.execute({                        
                userId: 'user-01',
                gymId: 'gym-01',
                userLatitude: -18.8676002,
                userLongitude: -41.9493979
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)        
    });

    it("should be able to check-in twice but different day", async () => {        
        vi.setSystemTime(new Date(2022, 0, 15, 6, 0, 6));
        
        await sut.execute({                        
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.8676002,
            userLongitude: -41.9493979
        });

        vi.setSystemTime(new Date(2022, 0, 16, 6, 0, 6));
        
        const { checkIn } = await sut.execute({                        
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.8676002,
            userLongitude: -41.9493979
        })

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check-in on distant gym", async () => {                        
        gymsInMemoryRepository.items.push({
            id: "gym-02",
            title: "Academia C#",
            description: "Academia focada em diversos tipos de atividades",
            latitue: new Decimal(0),
            longitude: new Decimal(0),
            phone: ""
        });        

        await expect(() => 
            sut.execute({                        
                userId: 'user-02',
                gymId: 'gym-01',
                userLatitude: -18.9174078,
                userLongitude: -41.9454506
            })

        ).rejects.toBeInstanceOf(MaxDistanceError)
    });
});


