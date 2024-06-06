import {ApiProperty} from "@nestjs/swagger";
import {AbstractEntity} from "./abstract.entity";
import {Column, CreateDateColumn, Entity, UpdateDateColumn} from "typeorm";
import {EventDateModel, EventStatus} from "../../common";

export interface IEventRequestEntity {
    id: string;
    eventId: string;
    author: string;
    name: string;
    description: string;
    date: EventDateModel[];
    city: string;
    place: string;
    address: string;
    mainImage: string;
    images: string[];
    ageLimit: string;
    price: number;
    currency: string;
    tags: string[];
    categories: string[];
    organizers: string[];
    status: EventStatus;
}

@Entity({name: "event_request"})
export class EventRequestEntity extends AbstractEntity implements IEventRequestEntity {
    @ApiProperty({type: String, description: "Id потенциального мероприятия", required: true})
    @Column({type: "varchar", nullable: false})
    eventId: string;

    @ApiProperty({type: String, required: true, default: "Id создателя мероприятия"})
    @Column({type: "varchar", nullable: false})
    author: string;

    @ApiProperty({type: String, required: true, default: "Яндекс конференция"})
    @Column({type: "varchar", nullable: false})
    name: string;

    @ApiProperty({type: String, required: false, default: "Хорошее мероприятие"})
    @Column({type: "varchar", nullable: true, default: ""})
    description: string;

    @ApiProperty({type: [EventDateModel], required: true, description: "Даты начал и концов мероприятий"})
    @Column("jsonb", {nullable: false})
    date: EventDateModel[];

    @ApiProperty({type: String, required: true, description: "Город", default: "Калининград"})
    @Column({type: 'varchar', default: false})
    city: string;

    @ApiProperty({type: String, required: true, description: "Название здания (места)", default: "Moscow city"})
    @Column({type: "varchar", nullable: false})
    place: string;

    @ApiProperty({type: String, required: false, description: "Адрес"})
    @Column({type: "varchar", nullable: false})
    address: string;

    @ApiProperty({type: String, description: "Обложка мероприятия", required: true})
    @Column({type: "varchar", nullable: false})
    mainImage: string;

    @ApiProperty({type: String, description: "Галерея мероприятия", required: true})
    @Column("jsonb", {nullable: true})
    images: string[];

    @ApiProperty({type: String, required: false, default: ""})
    @Column({type: "varchar", nullable: true})
    ageLimit: string;

    @ApiProperty({type: Number, required: false, description: "Цена", default: 0})
    @Column({type: "int", default: 0})
    price: number;

    @ApiProperty({type: String, required: false, description: "Курс мероприятия", default: "RUB"})
    @Column({type: "varchar", nullable: false})
    currency: string;

    @ApiProperty({type: String, description: "Id получателя жалобы", required: true})
    @Column("jsonb", {nullable: true})
    tags: string[];

    @ApiProperty({type: [String], required: false, description: "Категории", default: []})
    @Column("jsonb", {nullable: true})
    categories: string[];

    @ApiProperty({type: [String], required: false, description: "Организаторы", default: []})
    @Column("jsonb", {nullable: true})
    organizers: string[];

    @ApiProperty({
        type: String,
        description: "Статус",
        default: EventStatus.WILL_BE,
        required: false
    })
    @Column({type: "varchar", nullable: false})
    status: EventStatus;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ApiProperty({type: String, description: "Дата создания"})
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}