import {v4 as uuidv4} from "uuid";
import {BadRequestException} from "@nestjs/common";
import {TypeCollection} from "../../enums";
import {Multer} from "multer";

export const getShortPathImage = (id: string, collection: TypeCollection, imageName: string) => {
    if (!imageName)
        return "";

    return `${collection}/${id}/${imageName}`;
};

export const getFullPathImage = (id: string, collection: TypeCollection, imageName: string) => {
    if (!imageName)
        return "";

    const decodedPath = getShortPathImage(id, collection, imageName);
    return `${process.env.BASE_FILES_URL}/${decodedPath}`;
    // const decodedPath = encodeURIComponent(getShortPathImage(id, collection, imageName));
    // return `${process.env.BASE_FILES_URL}/${decodedPath}?alt=media`;
};

export const getMainImageFullName = (image: Express.Multer.File) => {
    const shortFileName = image.originalname.split('.');
    const typeFile = shortFileName[shortFileName.length - 1];
    return `mainImage.${typeFile}`;
}

export const getPathMainImageByParams = (image: Express.Multer.File, id: string, collection: string) => {
    const imageFullName = getMainImageFullName(image);
    const pathToImage = getShortPathImage(id, collection as TypeCollection, imageFullName);
    const fullPathToImage = getFullPathImage(id, collection as TypeCollection, imageFullName);
    return {fullPathToImage, pathToImage, imageFullName};
};

export const getPathExtraImageByParams = (image: Express.Multer.File, id: string, collection: string) => {
    const fileNameBefore = image.originalname.split('.');
    const typeFile = fileNameBefore[fileNameBefore.length - 1];

    const imageFullName = `image_${uuidv4().replace("-", "").slice(0, 8)}.${typeFile}`;
    const pathToImage = getShortPathImage(String(id), collection as TypeCollection, imageFullName);

    const fullPathToImage = getFullPathImage(id, collection as TypeCollection, imageFullName);
    return {fullPathToImage, pathToImage, imageFullName};
};

// https://s3.timeweb.cloud/5e14fcf3-e6929621-4462-4144-9119-5c06f32c1cbb/events/66107b4fbca54decfe6f59c1/mainImage.jpg
export const parseImageUrl = (imageUrl: string) => {
    const responseError = {code: 0, data: "Неправильный формат ссылки на картинку."};

    if (!imageUrl) {
        throw new BadRequestException(responseError);
    }

    try {
        const parts = imageUrl.split("/");
        const bucketName = parts[parts.length - 4];
        const collectionName = parts[parts.length - 3];
        const recordId = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];

        if (!bucketName || !collectionName || !recordId || !fileName) {
            throw new BadRequestException(responseError);
        }

        return {bucketName, collectionName, recordId, fileName};
    } catch (err) {
        throw new BadRequestException(responseError);
    }
}