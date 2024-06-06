import mongoose from "mongoose";
import fs from "fs";
import {Repository} from "typeorm";
import {AbstractEntity} from "../../database/entities/abstract.entity";

export const getObjectId = (id: any) => {
    try {
        const objectId = id ? new mongoose.Types.ObjectId(id) : null;
        if (!objectId || !id || id.toString() !== objectId.toString()) {
            return null;
        }
        return objectId;
    } catch (e) {
        return null;
    }
};

export const isValidUUID = (uuid: string | null | undefined) => {
    try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isValid = uuidRegex.test(uuid ?? "");
        if (isValid) return uuid as string;

        return null;
    } catch (e) {
        return null;
    }
};

export const getFiles = (dir: string, files: string[] = []) => {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
};

export const isEmptyObject = (obj: any) => {
    for (const key in obj) {
        return false;
    }
    return true;
};

export const parseJson = (data: string) => {
    try {
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
};

export const getExistingRecords = async (repository: Repository<AbstractEntity>, ids: string[])=> {
    const existingRecords: AbstractEntity[] = [];
    if (!Array.isArray(ids)) {
        return existingRecords;
    }

    for (const id of ids) {
        const foundRecord = await repository.findOne({where: {id}});
        if (foundRecord) {
            existingRecords.push(foundRecord);
        }
    }

    return existingRecords;
};