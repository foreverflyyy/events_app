import { Injectable } from '@nestjs/common';
import mongoose from "mongoose";

import {CategoriesRepository} from "../../database/repositories";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    getCategories() {
        return this.categoriesRepository.find({});
    }

    getCategoryById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.categoriesRepository.findOne({_id: id});
    }
}
