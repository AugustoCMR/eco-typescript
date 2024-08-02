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
    
    async updateUser(id: number, user: User)
    {   
        await userRepository.save
        (
            {
               ...user,
               id
            }
        )
    }

    async deleteUser(id: number)
    {
        await userRepository.delete(id);
    }
}