import {Module} from '@nestjs/common';
import {MapController} from './controllers/map.controller';
import {MapService} from './services/map.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Address, AddressSchema} from "../database/schemas";
import {AddressController} from "./controllers/address.controller";
import {AddressService} from "./services/address.service";
import {HttpModule} from "@nestjs/axios";
import {AddressRepository} from "../database/repositories";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Address.name, schema: AddressSchema}
        ]),
        HttpModule
    ],
    controllers: [
        MapController,
        AddressController
    ],
    providers: [
        MapService,
        AddressService, AddressRepository
    ]
})

export class MapModule {
}