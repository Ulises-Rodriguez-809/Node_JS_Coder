import { GetUserDto} from '../dao/dto/user.dto.js';

export class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getUser(user){
        const userInfo = await this.dao.getUser(user);

        const getUserDtoFront = new GetUserDto(userInfo);

        return getUserDtoFront;
    }
}