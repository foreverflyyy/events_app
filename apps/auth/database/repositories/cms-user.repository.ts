import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AbstractRepository} from "./abstract.repository";
import {CmsUser} from "../schemas";

@Injectable()
export class CmsUserRepository extends AbstractRepository<CmsUser> {
    constructor(
        @InjectModel(CmsUser.name) private cmsUserModel: Model<CmsUser>
    ) {
        super(cmsUserModel);
    }
}