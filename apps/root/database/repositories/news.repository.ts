import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AbstractWithExtraImagesRepository} from './abstract.repository';

import {News} from "../schemas";

@Injectable()
export class NewsRepository extends AbstractWithExtraImagesRepository<News> {
    constructor(@InjectModel(News.name) private newsModel: Model<News>) {
        super(newsModel);
    }
}