import path from "path";
import {Module} from '@nestjs/common';
import {StaffService} from './staff.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StaffController} from "./staff.controller";
import {AUTH_PACKAGE_NAME, AUTH_SERVICE} from "../common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {RoleEntity, RootEntity, StaffEntity} from "../database/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffEntity, RootEntity, RoleEntity]),
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: path.join(__dirname, "proto/auth.proto"),
          url: process.env.AUTH_URL
        }
      }
    ])
  ],
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}