import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {AbstractRepository} from './abstract.repository';
import {Tag} from "../schemas";

@Injectable()
export class TagsRepository extends AbstractRepository<Tag> {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<Tag>
  ) {
    super(tagModel);
  }
}