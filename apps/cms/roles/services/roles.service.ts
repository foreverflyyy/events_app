import {Injectable} from '@nestjs/common';
import {CreateRoleDto, UpdateRoleDto} from "../dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RoleEntity, RootEntity} from "../../database/entities";
import {getExistingRecords, isValidUUID} from "../../../root/common/utils";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        @InjectRepository(RootEntity) private rootsRepository: Repository<RootEntity>
    ) {
    }

    async getRoles() {
        return await this.rolesRepository.find({
            select: {
                availableRoots: {
                    id: true,
                    name: true,
                    code: true
                }
            },
            relations: {
                availableRoots: true
            }
        });
    }

    async createRole(dto: CreateRoleDto) {
        const {availableRoots, ...otherDto} = dto;
        const relevantRoots = await getExistingRecords(this.rootsRepository, availableRoots);

        return await this.rolesRepository.save({
            ...otherDto,
            availableRoots: relevantRoots
        });
    }

    async updateRole(id: string, dto: UpdateRoleDto) {
        if (!isValidUUID(id)) {
            return null;
        }

        const foundRecord = await this.rolesRepository.findOne({
            where: {id},
            relations: {availableRoots: true}
        });
        if (!foundRecord) {
            return null;
        }

        const {availableRoots, ...otherDto} = dto;
        if (availableRoots) {
            const relevantRoots = await getExistingRecords(this.rootsRepository, availableRoots);
            return await this.rolesRepository.save({
                ...foundRecord,
                ...otherDto,
                availableRoots: relevantRoots
            });
        }

        return await this.rolesRepository.save({
            ...foundRecord,
            ...otherDto
        });
    }

    deleteRole(id: string) {
        if (!isValidUUID(id)) {
            return null;
        }

        return this.rolesRepository.delete({id: id});
    }
}
