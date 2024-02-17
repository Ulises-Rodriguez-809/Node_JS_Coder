import { GetUserDto} from '../dao/dto/user.dto.js';

export class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getUser(user){
        const {email} = user;

        const userInfo = await this.dao.getUser({email});

        const getUserDtoFront = new GetUserDto(userInfo);

        return getUserDtoFront;
    }
}