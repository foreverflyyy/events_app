import {OmitType, PartialType} from "@nestjs/swagger";
import {User} from "apps/root/database/schemas";

export class UpdateUserDto extends PartialType(OmitType(
    User,
    ["phoneCode", "mainImage", "favourites", "events", "ownEvents"]
)) {}