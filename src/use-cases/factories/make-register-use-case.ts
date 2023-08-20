import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCases } from "../register";

export function makeRegisterUseCase() {
    const userRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCases(userRepository);

    return registerUseCase;
}