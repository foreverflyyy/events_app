import {BadRequestException, Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {catchError, firstValueFrom} from "rxjs";
import {AxiosError} from "axios";
import {ISimilarAddressData} from "../types";

@Injectable()
export class MapService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
    };

    async getSameAddresses(search: string) {
        try {
            const apiKey = process.env.ADDRESSES_API_KEY;

            const {data} = await firstValueFrom(
                this.httpService.post<any>(
                    `http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
                    {query: search},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Token " + apiKey
                        }
                    }
                ).pipe(
                    catchError(() => {
                        throw new BadRequestException({code: 0, data: "Не удалось выполнить запрос."});
                    }),
                ),
            );

            let needData: ISimilarAddressData[] = [];
            if (data && data.suggestions) {
                needData = data.suggestions;
            }

            return needData;
        } catch (err: any) {
            throw new BadRequestException({code: 0, data: "Не удалось выполнить запрос."});
        }
    }
}











