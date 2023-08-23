import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {          
    public items: CheckIn[] = [];
    
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf("date");
        const endOfTheDay = dayjs(date).endOf("date");
        
        const checkinOnSameDate = this.items.find((checkin) => {
            const checkInDate = dayjs(checkin.created_at);
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
            
            return checkin.user_id === userId && isOnSameDate;
        })
        
        if(!checkinOnSameDate) {
            return null;
        }
        
        return checkinOnSameDate;
    }
    
    async create(data: Prisma.CheckInUncheckedCreateInput){
        const checkin = {
            id: randomUUID(),            
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at ? new Date(data.validated_at) : null
        }
        
        this.items.push(checkin);
        return checkin;
    }        
    async findManyByUserId(userId: string, page: number) {
        const checkins = this.items.filter((item) => item.user_id === userId)
            .slice((page - 1) * 20,  page * 20);
        return checkins;
    }

    async countByUserId(userId: string) {
        const metrics = this.items.filter((item) => item.user_id === userId).length;
        return metrics;
    }

    async findById(id: string){
        const checkin = this.items.find((item) => item.id === id);

        if(!checkin) {
            return null;
        }
        
        return checkin;
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

        if(checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn;
        }

        return checkIn;
    }  
}