import mongoose, {FilterQuery, Model, PipelineStage, SaveOptions, Types, UpdateQuery} from 'mongoose';
import {
    AbstractSchema,
    AbstractSchemaWithImages,
    AbstractSchemaWithMainAndExtraImages,
    AbstractSchemaWithMainImage
} from '../schemas';

export abstract class AbstractRepository<TDocument extends AbstractSchema> {
    protected constructor(protected readonly model: Model<TDocument>) {
    }

    aggregate(pipeline: PipelineStage[] = [{$match: {}}]) {
        return this.model.aggregate(pipeline);
    }

    getById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.model.findById(id);
    }

    async create(document: Partial<TDocument>, options?: SaveOptions) {
        if (!document._id) {
            document._id = new Types.ObjectId();
        }

        const createdDocument = new this.model(document);
        return (await createdDocument.save(options)).toJSON() as unknown as TDocument;
    }

    findOne(filterQuery: FilterQuery<TDocument>) {
        return this.model.findOne(filterQuery, {}, {lean: true});
    }

    findByIdsShortInfo(ids: mongoose.Types.ObjectId[], remainedPipeline: PipelineStage[] = []) {
        return this.aggregate([{$match: {_id: {$in: ids}}}, ...remainedPipeline]);
    }

    findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>, options = {
        new: true,
        upsert: false
    }) {
        return this.model.findOneAndUpdate(filterQuery, update, options);
    }

    upsert(filterQuery: FilterQuery<TDocument>, document: Partial<TDocument>) {
        return this.model.findOneAndUpdate(filterQuery, document, {lean: true, upsert: true, new: true});
    }

    find(filterQuery: FilterQuery<TDocument>) {
        return this.model.find(filterQuery, {}, {lean: true});
    }

    deleteOne(filterQuery: FilterQuery<TDocument>) {
        return this.model.deleteOne(filterQuery);
    }

    updateMany(filters: FilterQuery<TDocument>, updateData: UpdateQuery<TDocument>) {
        return this.model.updateMany(filters, updateData);
    }
}

export abstract class AbstractWithMainImageRepository<TDocument extends AbstractSchemaWithMainImage> extends AbstractRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) {
        super(model);
    }

    // abstract addMainImage(id: string, mainImageName: string): Promise<void>;
    // abstract deleteMainImage(id: string): Promise<void>;

    async addMainImage(id: string, mainImageName: string) {
        await this.model.findOneAndUpdate({_id: id} as FilterQuery<TDocument>, {mainImage: mainImageName});
    };

    async deleteMainImage(id: string) {
        await this.model.findOneAndUpdate({_id: id} as FilterQuery<TDocument>, {mainImage: ""});
    };
}

export abstract class AbstractWithExtraImagesRepository<TDocument extends AbstractSchemaWithImages> extends AbstractRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) {
        super(model);
    }

    async addExtraImages(id: string, extraImageNames: string[]) {
        await this.model.findOneAndUpdate(
            {_id: id} as FilterQuery<TDocument>,
            {$addToSet: {images: extraImageNames}}
        );
    };

    async deleteExtraImages(id: string, extraImageNames: string[]) {
        await this.model.findOneAndUpdate(
            {_id: id} as FilterQuery<TDocument>,
            {$pullAll: {images: extraImageNames}}
        );
    };
}

export abstract class AbstractWithMainAndExtraImagesRepository<TDocument extends AbstractSchemaWithMainAndExtraImages>
    extends AbstractWithMainImageRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) {
        super(model);
    }

    async addExtraImages(id: string, extraImageNames: string[]) {
        await this.model.findOneAndUpdate(
            {_id: id} as FilterQuery<TDocument>,
            {$addToSet: {images: extraImageNames}}
        );
    };

    async deleteExtraImages(id: string, extraImageNames: string[]) {
        await this.model.findOneAndUpdate(
            {_id: id} as FilterQuery<TDocument>,
            {$pullAll: {images: extraImageNames}}
        );
    };
}

export type RepositoryWithImageFields = AbstractWithMainImageRepository<any> | AbstractWithExtraImagesRepository<any> | AbstractWithMainAndExtraImagesRepository<any>;