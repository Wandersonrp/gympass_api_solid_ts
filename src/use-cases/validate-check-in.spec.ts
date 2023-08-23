import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { LateCheckInValidationError } from "./error/late-check-in-validation-error";

let checkInsInMemoryRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
    beforeEach(() => {
        checkInsInMemoryRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInsInMemoryRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to validate the check-in", async () => {
        const createdCheckIn = await checkInsInMemoryRepository.create({            
            gym_id: "gym-01",
            user_id: "user-01",
        });
        
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        });
        
        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsInMemoryRepository.items[0].validated_at).toEqual(expect.any(Date));
    });  
    
    it("should not be able to validate an inexisting check-in", async () => {
        await expect(() => 
            sut.execute({
                checkInId: "inexisting-check-in-id"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });  

    it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

        const createdCheckIn = await checkInsInMemoryRepository.create({            
            gym_id: "gym-01",
            user_id: "user-01",
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;

        vi.advanceTimersByTime(twentyOneMinutesInMs)
        
        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id
            })        
        ).rejects.toBeInstanceOf(LateCheckInValidationError);
    });


});

