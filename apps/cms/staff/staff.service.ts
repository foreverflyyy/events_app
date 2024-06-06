import argon2 from "argon2";
import {Repository} from "typeorm";
import {AUTH_CMS_SERVICE_NAME, AUTH_SERVICE, AuthCmsServiceClient, GrpcErrorPayload} from "../common";
import {isUUID} from "class-validator";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {CreateUserStaffDto, UpdateUserStaffDto} from "./user-staff.dto";
import {RoleEntity, RootEntity, StaffEntity} from "../database/entities";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";

@Injectable()
export class StaffService implements OnModuleInit {
    private authService: AuthCmsServiceClient;

    constructor(
        @InjectRepository(StaffEntity) private staffRepository: Repository<StaffEntity>,
        @InjectRepository(RootEntity) private rootsRepository: Repository<RootEntity>,
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        @Inject(AUTH_SERVICE) private authClient: ClientGrpc
    ) {
    }

    onModuleInit() {
        this.authService =
            this.authClient.getService<AuthCmsServiceClient>(AUTH_CMS_SERVICE_NAME);
    }

    getStaff() {
        return this.staffRepository.find({
            select: {
                role: {
                    id: true,
                    name: true,
                    code: true
                }
            },
            relations: {
                role: true
            }
        });
    }

    getUserStaffById(id: string) {
        if (!isUUID(id)) {
            return null;
        }

        return this.staffRepository.findOne({
            where: {id},
            select: {
                role: {
                    id: true,
                    name: true,
                    code: true
                }
            },
            relations: {
                role: true
            }
        });
    }

    async createUserStaff(dto: CreateUserStaffDto) {
        const {role, login, password} = dto;
        if (!isUUID(role) || !password || !login) {
            throw new BadRequestException({code: 0, data: "Некорректно указанные параметры."});
        }

        const foundRole = await this.rolesRepository.findOne({where: {id: role}});
        if (!foundRole) {
            throw new BadRequestException({code: 0, data: "Такая роль не была найдена."});
        }

        const foundUser = await this.staffRepository.findOne({where: {login: login}});
        if (foundUser) {
            throw new BadRequestException({code: 0, data: "Такой login уже есть."});
        }

        const hashedPassword = await argon2.hash(password);
        const createdUser = await this.staffRepository.save({
            ...dto,
            password: hashedPassword,
            role: foundRole
        });

        await lastValueFrom(
            this.authService.addUser({
                userId: createdUser.id,
                name: createdUser.name,
                login: createdUser.login,
                password: hashedPassword,
                role: role
            })
                .pipe(timeout(5000))
                .pipe(catchError(error => throwError(() =>
                    new RpcException({details: error.details, code: error.code} as GrpcErrorPayload))))
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password: unneededPassword, ...otherDataUser} = createdUser;
        return otherDataUser;
    }

    async updateUserStaff(id: string, dto: UpdateUserStaffDto) {
        if (!isUUID(id)) {
            throw new BadRequestException({code: 0, data: "Некорректный id."});
        }

        const foundUser = await this.staffRepository.findOne({where: {id}});
        if (!foundUser) {
            throw new BadRequestException({code: 0, data: "Такой пользователь не был найден."});
        }

        const {role, ...otherDto} = dto;
        if (role) {
            const foundRole = await this.rolesRepository.findOne({where: {id: role}});
            if (!foundRole) {
                throw new BadRequestException({code: 0, data: "Такая роль не была найдена."});
            }

            return await this.staffRepository.save({
                ...foundUser,
                ...otherDto,
                role: foundRole
            });
        }

        return await this.staffRepository.save({
            ...foundUser,
            ...otherDto
        });
    }

    async deleteUser(id: string) {
        if (!isUUID(id)) {
            throw new BadRequestException({code: 0, data: "Некорректный id."});
        }

        await this.staffRepository.delete({id: id});

        await lastValueFrom(
            this.authService.deleteUser({userId: id, login: ""})
                .pipe(timeout(5000))
                .pipe(catchError(error => throwError(() =>
                    new RpcException({details: error.details, code: error.code} as GrpcErrorPayload))))
        );
    }
}
