import {ApiProperty} from "@nestjs/swagger";
import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, UpdateDateColumn} from "typeorm";
import {RootEntity} from "./root.entity";
import {AbstractEntity} from "./abstract.entity";

export interface IRoleEntity {
    id: string;
    name: string;
    code: string;
    availableRoots: RootEntity[];
}

@Entity({name: "role"})
export class RoleEntity extends AbstractEntity implements IRoleEntity{
    @ApiProperty({type: String, description: "Название роли", default: "Модератор", required: true})
    @Column({type: "varchar", nullable: false})
    name: string;

    @ApiProperty({type: String, description: "Код роли", default: "moderator", required: true})
    @Column({type: "varchar", nullable: false, unique: true})
    code: string;

    @ApiProperty({type: String, description: "Доступные права", default: []})
    // @Column("varchar", {array: true, default: []})
    @ManyToMany(() => RootEntity, {cascade: true})
    @JoinTable()
    availableRoots: RootEntity[];

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ApiProperty({type: String, description: "Дата создания"})
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}