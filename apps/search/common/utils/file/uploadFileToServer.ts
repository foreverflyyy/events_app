import fs from "fs";
import path from "path";
import {TypeCollection} from "../../enums";

const validImage = ['jpg', 'jpeg', 'png', 'heif', 'heic', 'webp'];
const pathToFolder = path.join(__dirname, "../../../../../tmp");

const checkPermissionImage = (image: any) => {
    if (image.size > (30 * 1024 * 1024))
        return {code: 0, data: 'Картинка слишком большая. Разрешено не более 4мб'};

    const mime = image.mimetype;
    if (!mime)
        return {code: 0, data: 'Недопустимый формат загружаемого файла.'};

    const type = mime.split('/')[1];
    if (!type || !validImage.includes(type))
        return {code: 0, data: 'Недопустимый формат загружаемого файла.'};

    return {code: 1, data: mime};
};

const moveFileByPath = (file: any, pathToFile: string) => {
    return new Promise((resolve) => {
        file.mv(pathToFile, (err: any) => {
            if (err)
                resolve(false);
            else
                resolve(true);
        });
    });
};

const removeFile = (pathToFile: string) => {
    return new Promise((resolve) => {
        fs.unlink(pathToFile, (err) => {
            if (err){
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

export default async (idRecord: string, image: any, collection: TypeCollection, nameImage: string) => {
    const resCheck = checkPermissionImage(image);
    if (!resCheck.code)
        return resCheck;

    const contentType = resCheck.data;
    const fileNameBefore = image.name.split('.');
    const typeFile = fileNameBefore[fileNameBefore.length - 1];
    const shortFileName = `${idRecord}_${nameImage}.${typeFile}`;
    const fileName = `${collection}_${shortFileName}`;
    const pathToFile = pathToFolder + '/' + fileName;

    const resMovedImage = await moveFileByPath(image, pathToFile);
    if (!resMovedImage)
        return {code: 0, data: 'Не удалось загрузить файл в папку tmp.'};

    const metadata = {
        metadata: { firebaseStorageDownloadTokens: "" },
        contentType: contentType
    };

    const fileNameForServer = `${collection}/${idRecord}/${nameImage}.${typeFile}`;

    // try {
    //     // Support for HTTP requests made with `Accept-Encoding: gzip`
    //     await bucket.upload(pathToFile, {gzip: true, metadata, destination: fileNameForServer});
    // } catch (error) {
    //     return { code: 0, data: 'Не удалось загрузить файл на сервер.' };
    // }

    const resRemoveFile = await removeFile(pathToFile);
    if (!resRemoveFile)
        return {code: 0, data: 'Не удалось удалить из папки tmp.'};

    return {
        code: 1,
        data: `${nameImage}.${typeFile}`
    };
};
