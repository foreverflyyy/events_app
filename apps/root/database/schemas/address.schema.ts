import mongoose, {HydratedDocument} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchema} from "./abstract.schema";

export interface IAddressSchema {
    _id: mongoose.Types.ObjectId;
    country: string;
    city: string;
    street: string;
    fullName: string;
    lon: string; // longitude - долгота
    lat: string; // latitude - широта
}

@Schema()
export class Address extends AbstractSchema implements IAddressSchema {
    @ApiProperty({type: String, description: "Страна", default: "Россия"})
    @Prop({type: String, required: true})
    country: string;

    @ApiProperty({type: String, description: "Город", default: "Калининград"})
    @Prop({type: String, required: true})
    city: string;

    @ApiProperty({type: String, description: "Улица", default: "Чкалова 1а"})
    @Prop({type: String, required: true})
    street: string;

    @ApiProperty({
        type: String,
        description: "Полное название (адрес)",
        default: "Россия, Калининград, Чкалова 1а"
    })
    @Prop({type: String, required: true})
    fullName: string;

    @ApiProperty({type: String, description: "Долгота", required: true})
    @Prop({type: String, required: true})
    lon: string;

    @ApiProperty({type: String, description: "Широта", required: true})
    @Prop({type: String, required: true})
    lat: string;
}

export type AddressDocument = HydratedDocument<Event>;

export const AddressSchema = SchemaFactory.createForClass(Address);