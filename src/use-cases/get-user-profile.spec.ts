import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./error/invalid-credentials-error";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./error/resource-not-found-error";

let userInMemoryRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
    beforeEach(() => {
        userInMemoryRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(userInMemoryRepository);
    });

    it("should be able to get user profile", async () => {
        const createdUser = await userInMemoryRepository.create({
            name: "John Doe",
            email: "johndoe@email.com",
            password_hash: await hash("123456", 6)
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.name).toEqual("John Doe");
    });

    it("should not be able to get user profile with wrong id", async () => {
        await expect(() =>
            sut.execute({
                userId: "non-existing-id"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });    
});


