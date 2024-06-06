import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {EventRequest} from "../schemas";
import {AbstractRepository} from "./abstract.repository";

@Injectable()
export class EventRequestsRepository extends AbstractRepository<EventRequest> {
    constructor(
        @InjectModel(EventRequest.name) private eventRequestModel: Model<EventRequest>
    ) {
        super(eventRequestModel);
    }
}