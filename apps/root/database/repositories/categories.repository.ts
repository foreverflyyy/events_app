import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {Category} from "../schemas";
import {AbstractRepository} from "./abstract.repository";

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {
        super(categoryModel);
    }
}