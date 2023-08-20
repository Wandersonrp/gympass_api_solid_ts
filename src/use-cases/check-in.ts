import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./error/max-distance-error";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error";

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkInRepository: CheckInsRepository, private gymsRepository: GymsRepository) {}

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if(!gym) {
            throw new ResourceNotFoundError();    
        }

        const distance = getDistanceBetweenCoordinates(
            {latitude: userLatitude, longitude: userLongitude},
            {latitude: Number(gym.latitue), longitude: Number(gym.longitude)}
        )

        const MAX_DISTANCE_IN_KILOMETER = 0.10;

        if(distance > MAX_DISTANCE_IN_KILOMETER) {
            throw new MaxDistanceError();
        }
        
        const checkinOnSameDay = await this.checkInRepository.findByUserIdOnDate(userId, new Date());                

        if(checkinOnSameDay) {
            throw new MaxNumberOfCheckInsError();
        }

        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId
        });


        if(!checkIn) {
            throw new ResourceNotFoundError();
        }

        return { checkIn }
    }
}