import mongoose from "mongoose";
import {Injectable} from '@nestjs/common';

import {CreateCategoryDto, UpdateCategoryDto} from "../dto";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: any) {}

    getCategories() {
        return this.categoriesRepository.find({});
    }

    getCategoryById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.categoriesRepository.findOne({_id: id});
    }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        return await this.categoriesRepository.create(createCategoryDto);
    }

    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.categoriesRepository.findOneAndUpdate({_id: id}, updateCategoryDto);
    }

    deleteCategory(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.categoriesRepository.deleteOne({_id: id});
    }
}
