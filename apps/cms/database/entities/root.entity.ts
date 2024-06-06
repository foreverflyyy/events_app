import {ApiProperty} from "@nestjs/swagger";
import {Column, CreateDateColumn, Entity, UpdateDateColumn} from "typeorm";
import {AbstractEntity} from "./abstract.entity";

export interface IRootEntity {
    id: string;
    name: string;
    code: string;
}

@Entity({name: "root"})
export class RootEntity extends AbstractEntity implements IRootEntity{
    @ApiProperty({type: String, description: "Название доступа", default: "Модератор", required: true})
    @Column({type: "varchar", nullable: false})
    name: string;

    @ApiProperty({type: String, description: "Код доступа", default: "moderator", required: true})
    @Column({type: "varchar", nullable: false, unique: true})
    code: string;

    @ApiProperty({type: String, description: "Дата обновления"})
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ApiProperty({type: String, description: "Дата создания"})
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}