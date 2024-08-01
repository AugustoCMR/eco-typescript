import { User } from "../models/userModel";
import { userRepository } from "../repositories/userRepository";

export class UserService
{
    async createUser(user: User)     
    {            
        user.codigo = 1;
        const newUser = userRepository.create(user);
        await userRepository.save(newUser);
    }        
}