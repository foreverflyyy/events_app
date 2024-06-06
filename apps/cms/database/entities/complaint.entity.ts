import {Column, CreateDateColumn, Entity, UpdateDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {ComplaintTargetCollections} from "../../common";
import {AbstractEntity} from "./abstract.entity";

export enum ComplaintStatus {
    CONSIDERATION = "consideration",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}

export interface IComplaintEntity {
    id: string;
    author: string;
    target: string;
    targetType: ComplaintTargetCollections;
    title: string;
    text: string;
    isViewed: boolean;
    createdAt: Date;
}

@Entity({name: "complaint"})
export class ComplaintEntity extends AbstractEntity implements IComplaintEntity {
    @ApiProperty({type: String, description: "Id автора жалобы", required: true})
    @Column({type: "varchar", nullable: false})
    author: string;

    @ApiProperty({type: String, description: "Id получателя жалобы", required: true})
    @Column({type: "varchar", nullable: false})
    target: string;

    @ApiProperty({
        type: String,
        description: "Коллекция получателя",
        enum: ComplaintTargetCollections,
        default: ComplaintTargetCollections.Events
    })
    @Column({type: 'enum', enum: ComplaintTargetCollections, default: ComplaintTargetCollections.Events})
    targetType: ComplaintTargetCollections;

    @ApiProperty({type: String, description: "Заголовок", default: "", required: false})
    @Column({type: "varchar", nullable: true, default: ""})
    title: string;

    @ApiProperty({type: String, description: "Текст", required: true})
    @Column({type: "varchar", nullable: false})
    text: string;

    @ApiProperty({type: Boolean, description: "Флаг просомтра", default: true, required: false})
    @Column({type: 'boolean', default: false})
    isViewed: boolean;

    @ApiProperty({type: String, description: "Статус", enum: ComplaintStatus, default: ComplaintStatus.CONSIDERATION})
    @Column({type: 'enum', enum: ComplaintStatus, default: ComplaintStatus.CONSIDERATION})
    status: ComplaintStatus;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ApiProperty({type: String, description: "Дата создания"})
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}