import {ApiProperty} from "@nestjs/swagger";
import {User} from "apps/root/database/schemas";

export class UserResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: User, description: "Полученные данные"})
  data: object;
}

export class UsersResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [User], description: "Полученные данные"})
  data: any;
}