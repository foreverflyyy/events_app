import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {Event} from "./event.schema";
import {Tag} from "./tag.schema";
import {Category} from "./category.schema";
import {Achievement} from "./achievement.schema";
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchemaWithMainImage} from "./abstract.schema";

const ObjectId = mongoose.Schema.Types.ObjectId;

export enum Sex {
    Male = 'male',
    Female = 'female',
    Unknown = 'unknown'
}

export enum Role {
    User = 'user',
    Admin = 'admin',
    Organizer = 'organizer'
}

export interface IUserSchema {
    _id: mongoose.Types.ObjectId;
    login: string;
    email: string;
    phone: string;
    phoneCode: string;
    password: string;
    name: string;
    role: Role;
    mainImage: string;
    city: string;
    sex: Sex;
    birthday: string;
    description: string;
    tags: Tag[];
    categories: Category[];
    favourites: Event[];
    events: Event[];
    ownEvents: Event[];
    achievements: Achievement[];
    active: boolean;
    registerAt: Date;
    lastSeen: Date;
}

@Schema()
export class User extends AbstractSchemaWithMainImage implements IUserSchema{
    @ApiProperty({type: String, required: false, default: "amazing_user123"})
    @Prop({type: String, required: false, default: ""})
    login: string;

    @ApiProperty({type: String, required: false, default: "amazing_user123@gmail.com"})
    @Prop({type: String, required: false, default: ""})
    email: string;

    @ApiProperty({type: String, required: false, default: "+79553461385"})
    @Prop({type: String, required: false, default: ""})
    phone: string;

    @Prop({type: String, required: false, default: ""})
    phoneCode: string;

    @ApiProperty({type: String, required: true, default: "amazing007"})
    @Prop({type: String, required: false, default: ""})
    password: string;

    @ApiProperty({type: String, required: false, default: "Maxim"})
    @Prop({type: String, required: false, default: ""})
    name: string;

    @ApiProperty({type: String, required: false, default: "user"})
    @Prop({type: String, enum: Role, default: Role.User})
    role: Role;

    // @ApiProperty({type: String, required: false, description: "Аватарка пользователя", default: ""})
    // @Prop({type: String, required: false, default: ""})
    // mainImage: string;

    @ApiProperty({type: String, required: false, default: "Калининград"})
    @Prop({type: String, required: false, default: "Калининград"})
    city: string;

    @ApiProperty({type: String, description: "Пол пользователя", required: false, default: Sex.Unknown})
    @Prop({ type: String, enum: Sex, default: Sex.Unknown })
    sex: Sex;

    @ApiProperty({type: String, required: false, default: "16.11.2002"})
    @Prop({type: String, required: false, default: ""})
    birthday: string;

    @ApiProperty({type: String, description: "Описание пользователя", required: false})
    @Prop({type: String, required: false, default: ""})
    description: string;

    @ApiProperty({ type: [String], required: false, description: "Теги юзера", default: [] })
    @Prop({type: [{type: ObjectId, ref: 'Tag'}], default: []})
    tags: Tag[];

    @ApiProperty({type: [String], required: false, description: "Новости", default: []})
    @Prop({type: [{type: ObjectId, ref: 'News'}], default: []})
    news: string[];

    @ApiProperty({ type: [String], required: false, description: "Категории юзера", default: [] })
    @Prop({type: [{type: ObjectId, ref: 'Category'}], default: []})
    categories: Category[];

    @ApiProperty({ type: [String], required: false, description: "Отмеченные мероприятия пользователем", default: [] })
    @Prop({type: [{type: ObjectId, ref: 'Event'}], default: []})
    favourites: Event[];

    @ApiProperty({ type: [String], required: false, description: "Мероприятия, на которые идёт юзер", default: [] })
    @Prop({type: [{type: ObjectId, ref: 'Event'}], default: []})
    events: Event[];

    @ApiProperty({ type: [String], required: false, description: "Собственные мероприятия пользователя", default: [] })
    @Prop({type: [{type: ObjectId, ref: 'Event'}], default: []})
    ownEvents: Event[];

    @ApiProperty({ type: [String], required: false, description: "Достижения пользователя", default: [] })
    @Prop({type: [{type: ObjectId, ref: 'Achievement'}], default: []})
    achievements: Achievement[];

    @Prop({type: Boolean, default: true})
    active: boolean;

    @Prop({type: Date, default: Date.now()})
    registerAt: Date;

    @Prop({type: Date, default: Date.now()})
    lastSeen: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);