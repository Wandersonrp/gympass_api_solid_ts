import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./error/user-already-exists-error";

interface RegisterUseCasesRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCases {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: RegisterUseCasesRequest) {
        const password_hash = await hash(password, 6);
        
        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if(userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        await this.usersRepository.create({
            name, 
            email, 
            password_hash
        });
    }
}
