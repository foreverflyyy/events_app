import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class AbstractSchema {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    @Prop({ type: SchemaTypes.ObjectId, default: new mongoose.Types.ObjectId() })
    _id: Types.ObjectId;
}