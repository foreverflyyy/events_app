import {ApiProperty} from "@nestjs/swagger";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AbstractEntity {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    @PrimaryGeneratedColumn("uuid")
    id: string;
}