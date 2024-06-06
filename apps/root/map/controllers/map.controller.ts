import {
    Controller,
    Get, Query
} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {MapService} from "../services/map.service";
import {SimilarAddressesResponse} from "../dto";

@ApiTags("Map")
@Controller("map")
export class MapController {
    constructor(private mapService: MapService) {}

    @Get("getSimilarAddresses")
    @ApiOperation({summary: "Получение списка адресов по search"})
    @ApiOkResponse({type: SimilarAddressesResponse})
    async getSimilarAddresses(@Query("search") search: string) {
        const response = await this.mapService.getSameAddresses(search);
        return {code: 1, data: response};
    }
}
