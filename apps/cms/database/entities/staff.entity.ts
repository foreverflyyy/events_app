import {ApiProperty} from "@nestjs/swagger";
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn} from "typeorm";
import {RoleEntity} from "./role.entity";
import {AbstractEntity} from "./abstract.entity";

export interface IStaffEntity {
    id: string;
    name: string;
    login: string;
    password: string;
    role: RoleEntity;
}

@Entity({name: "staff"})
export class StaffEntity extends AbstractEntity implements IStaffEntity {
    @ApiProperty({type: String, description: "Имя", default: "Андрей Андреевич", required: true})
    @Column({type: "varchar", nullable: false})
    name: string;

    @ApiProperty({type: String, description: "Login", default: "admin", required: true})
    @Column({type: "varchar", nullable: false, unique: true})
    login: string;

    @ApiProperty({type: String, description: "Пароль", default: "admin", required: true})
    @Column({type: "varchar", nullable: false, select: false})
    password: string;

    @ApiProperty({type: String, required: true, default: ""})
    @ManyToOne(() => RoleEntity)
    @JoinColumn()
    role: RoleEntity;

    @ApiProperty({type: String, description: "Дата обновления"})
    @UpdateDateColumn({ name: 'updated_at', select: false })
    updatedAt: Date;

    @ApiProperty({type: String, description: "Дата создания"})
    @CreateDateColumn({ name: 'created_at', select: false })
    createdAt: Date;
}