import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymUseCasesRequest {
    title: string;
    description: string | null;    
    phone: string | null;
    latitue: number;
    longitude: number;
}

interface CreateGymUseCasesResponse {
    gym: Gym;
}

export class CreateGymUseCase {
    constructor(private gymRepository: GymsRepository) {}

    async execute({ title, description, phone, latitue, longitude }: CreateGymUseCasesRequest): Promise<CreateGymUseCasesResponse> {                
        const gym = await this.gymRepository.create({
            title, description, phone, latitue, longitude
        });

        return { gym };
    }
}
