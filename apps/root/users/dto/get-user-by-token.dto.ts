import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";
import {IGetUserByTokenDto} from "@app/common/types";

export class GetUserByTokenDto implements IGetUserByTokenDto{
  @ApiProperty({
    type: String,
    required: false,
    description: "Access token",
    default: ""
  })
  @IsString()
  @IsOptional()
  accessToken?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: "Refresh token",
    default: ""
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}