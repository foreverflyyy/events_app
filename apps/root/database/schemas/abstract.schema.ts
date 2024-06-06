import {ApiProperty} from "@nestjs/swagger";
import {Prop, Schema} from '@nestjs/mongoose';
import mongoose, {SchemaTypes, Types} from 'mongoose';

@Schema()
export class AbstractSchema {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    @Prop({type: SchemaTypes.ObjectId, default: new mongoose.Types.ObjectId()})
    _id: Types.ObjectId;
}

@Schema()
export class AbstractSchemaWithMainImage extends AbstractSchema {
    @ApiProperty({type: 'string', required: true, description: "Основная картинка"})
    @Prop({type: String, default: ""})
    mainImage: string;
}

@Schema()
export class AbstractSchemaWithImages extends AbstractSchema {
    @ApiProperty({type: [String], required: false, description: "Картинки."})
    @Prop({type: [String], default: []})
    images: string[];
}

@Schema()
export class AbstractSchemaWithMainAndExtraImages extends AbstractSchema {
    @ApiProperty({type: 'string', required: true, description: "Основная картинка"})
    @Prop({type: String, default: ""})
    mainImage: string;

    @ApiProperty({type: [String], required: false, description: "Картинки."})
    @Prop({type: [String], default: []})
    images: string[];
}