import {UsersRepository} from './users.repository.js';
import {Users} from '../dao/managersDB/userManager.js'

const User = new Users();

export const userService = new UsersRepository(User);