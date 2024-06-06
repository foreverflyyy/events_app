import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleEntity, RootEntity} from "../database/entities";
import {RolesService, RootsService} from './services';
import {RolesController, RootsController} from "./controllers";

@Module({
  imports: [
    TypeOrmModule.forFeature([RootEntity, RoleEntity])
  ],
  controllers: [RolesController, RootsController],
  providers: [RolesService, RootsService]
})
export class RolesModule {}
