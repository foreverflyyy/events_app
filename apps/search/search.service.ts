import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {EventSearchBody} from "./common";

@Injectable()
export class SearchService {
    constructor(private readonly elasticService: ElasticsearchService) {
    }

    async checkIndex() {
        const index = process.env.ELASTIC_INDEX!;
        try {
            const checkedIndex = await this.elasticService.indices.exists({index});
            if (!checkedIndex) {
                return {code: 0, data: "Индекс не создан"};
            }

            return {code: 1, data: "Индекс уже создан"};
        } catch (err) {
            return {code: 0, data: "Не удалось найти нужный индекс", err};
        }
    }

    async createIndex() {
        const checkedIndex = await this.checkIndex();
        if (checkedIndex) {
            return {code: 0, data: "Индекс уже есть"};
        }

        await this.elasticService.indices.create({
            index: process.env.ELASTIC_INDEX!,
            body: {}
        });
    }

    async indexEvent(data: EventSearchBody) {
        try {
            return await this.elasticService.index<EventSearchBody>({
                index: process.env.ELASTIC_INDEX!,
                id: data.id,
                document: data
            });
        } catch (err) {
            throw new InternalServerErrorException({
                code: 0,
                data: "Возникла ошибка при попытке задать данные",
                err: err
            });
        }
    }

    async get(documentId: string) {
        try {
            const response = await this.elasticService.get({
                index: process.env.ELASTIC_INDEX!,
                id: documentId
            });

            const {_source: result} = response;
            return {code: 0, data: result};
        } catch (err) {
            throw new InternalServerErrorException({
                code: 0,
                data: "Возникла ошибка при попытке получить данные по documentId",
                err: err
            });
        }
    }

    async search(text: string) {
        try {
            const response = await this.elasticService.search({
                index: process.env.ELASTIC_INDEX!,
                query: {
                    // match: {
                    //     name: text
                    // }
                    multi_match: {
                        query: text,
                        fields: ["name", "description"]
                    }
                }
            });

            const {hits: {hits}} = response;
            const result = hits.map((item) => item._source);
            return {code: 0, data: result};
        } catch (err) {
            throw new InternalServerErrorException({
                code: 0,
                data: "Возникла ошибка при попытке получить данные",
                err: err
            });
        }
    }

    async update(data: EventSearchBody) {
        const {id, ...otherData} = data;
        const response = await this.elasticService.update({
            index: process.env.ELASTIC_INDEX!,
            id: id,
            doc: otherData
        });

        const {_shards: result} = response;
        return {code: 0, data: result};
    }

    async deleteByDocumentId(docId: string) {
        try {
            const response = await this.elasticService.delete({
                index: process.env.ELASTIC_INDEX!,
                id: docId
            });

            const {_shards: result} = response;
            return {code: 1, data: result};
        } catch (err) {
            throw new InternalServerErrorException({
                code: 0,
                data: "Не удалось удалить документ по id.",
                err: err
            });
        }
    }

    async deleteByIndex() {
        try {
            const response = await this.elasticService.indices.delete({index: process.env.ELASTIC_INDEX!});

            const {_shards: result} = response;
            return {code: 1, data: result};
        } catch (err) {
            throw new InternalServerErrorException({
                code: 0,
                data: "Не удалось удалить индекс",
                err: err
            });
        }
    }
}
