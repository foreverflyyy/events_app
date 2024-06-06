import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {AbstractRepository} from './abstract.repository';
import {RootUser} from "../schemas";

@Injectable()
export class RootUserRepository extends AbstractRepository<RootUser> {
    constructor(
        @InjectModel(RootUser.name) private rootUserModel: Model<RootUser>
    ) {
        super(rootUserModel);
    }
}