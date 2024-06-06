import {Injectable} from '@nestjs/common';
import {CreateRootDto, UpdateRootDto} from "../dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RootEntity} from "../../database/entities";
import {isValidUUID} from "../../common";

@Injectable()
export class RootsService {
    constructor(
        @InjectRepository(RootEntity)
        private rootsRepository: Repository<RootEntity>
    ) {}

    getRoots() {
        return this.rootsRepository.find();
    }

    async createRoot(dto: CreateRootDto) {
        return await this.rootsRepository.save(dto);
    }

    updateRoot(id: string, dto: UpdateRootDto) {
        if (!isValidUUID(id)) {
            return null;
        }

        return this.rootsRepository.update({id: id}, dto);
    }

    deleteRoot(id: string) {
        if (!isValidUUID(id)) {
            return null;
        }

        return this.rootsRepository.delete({id: id});
    }
}
