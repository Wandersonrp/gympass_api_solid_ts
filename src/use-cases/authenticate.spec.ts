import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./error/invalid-credentials-error";

let userInMemoryRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        userInMemoryRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(userInMemoryRepository);
    });

    it("should be able to authenticate", async () => {
        await userInMemoryRepository.create({
            name: "John Doe",
            email: "johndoe@email.com",
            password_hash: await hash("123456", 6)
        });

        const { user } = await sut.execute({
            email: "johndoe@email.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to authenticate with wrong email", async () => {
        await expect(() =>
            sut.execute({
                email: "johndoe@email.com",
                password: "123123"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should not be able to authenticate with wrong password", async () => {
        await userInMemoryRepository.create({
            name: "John Doe",
            email: "johndoe@email.com",
            password_hash: await hash("123456", 6)
        });

        await expect(() =>
            sut.execute({
                email: "johndoe@email.com",
                password: "123123"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    })
});


