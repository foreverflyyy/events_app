import mongoose, {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AbstractWithMainAndExtraImagesRepository} from './abstract.repository';

import {Event} from "../schemas";
import {pipelineForShortEvent} from "../pipelines";

@Injectable()
export class EventRepository extends AbstractWithMainAndExtraImagesRepository<Event> {
    constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {
        super(eventModel);
    }

    findByIdsShortInfo(ids: mongoose.Types.ObjectId[]) {
        return this.aggregate([{$match: {_id: {$in: ids}}}, ...pipelineForShortEvent]);
    }
}