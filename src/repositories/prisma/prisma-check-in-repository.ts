import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository"
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInRepository implements CheckInsRepository {

    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id
            }
        });

        return checkIn;
    }

    async findManyByUserId(userId: string, page: number) {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                id: userId,
            },
            take: 20,
            skip: (page - 1) * 20
        });

        return checkIns;
    }

    async countByUserId(userId: string) {
        const count = await prisma.checkIn.count({
            where: {
                id: userId,
            }
        });

        return count;
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id,
            },
            data,
        });

        return checkIn;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkin = await prisma.checkIn.create({
            data
        });        
        
        return checkin;
    }
    
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf("date");
        const endOfTheDay = dayjs(date).endOf("date");
        
        const userIdCheckinOnDate = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate()
                }
            }
        });

        if(!userIdCheckinOnDate) {
            return null;
        }

        return userIdCheckinOnDate;
    }
}