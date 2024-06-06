import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {AgeLimit} from "../schemas";
import {AbstractRepository} from "./abstract.repository";

@Injectable()
export class AgeLimitsRepository extends AbstractRepository<AgeLimit> {
    constructor(
        @InjectModel(AgeLimit.name) private ageLimitModel: Model<AgeLimit>
    ) {
        super(ageLimitModel);
    }
}