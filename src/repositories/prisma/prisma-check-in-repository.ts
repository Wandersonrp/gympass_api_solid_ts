import { Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository"
import { prisma } from "@/lib/prisma";

export class PrismaCheckInRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkin = await prisma.checkIn.create({
            data
        });        
        
        return checkin;
    }
    
    async findByUserIdOnDate(userId: string, date: Date) {
        const userIdCheckinOnDate = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                 created_at: date
            }
        });

        if(!userIdCheckinOnDate) {
            return null;
        }

        return userIdCheckinOnDate;
    }
}