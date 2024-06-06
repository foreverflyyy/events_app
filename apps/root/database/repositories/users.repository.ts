import mongoose, {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AbstractWithMainImageRepository} from './abstract.repository';

import {User} from "../schemas";
import {pipelineForShortUser} from "../pipelines";

@Injectable()
export class UsersRepository extends AbstractWithMainImageRepository<User> {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super(userModel);
    }

    findByIdsShortInfo(ids: mongoose.Types.ObjectId[]) {
        return this.aggregate([{$match: {_id: {$in: ids}}}, ...pipelineForShortUser]);
    }

    getUserByParams(params: { login?: string, email?: string, phone?: string }) {
        const {login = "", email = "", phone = ""} = params;
        if (!login && !email && !phone) {
            return null;
        }

        let filter: any;
        if (login) {
            filter = {login};
        } else if (email) {
            filter = {email};
        } else if (phone) {
            filter = {phone};
        }
        return this.findOne(filter);
    }
}