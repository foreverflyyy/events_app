import {Inject, Injectable, OnModuleDestroy} from "@nestjs/common";
import {
    CopyObjectCommand,
    GetObjectCommand, S3Client,
    DeleteObjectCommand, DeleteObjectsCommand,
    ListObjectsV2Command, PutObjectCommand
} from "@aws-sdk/client-s3";

@Injectable()
export class StorageRepository implements OnModuleDestroy {
    DEFAULT_BUCKET = "5e14fcf3-6cdd18b6-a077-4cc9-a45f-a13db954bd4d";

    constructor(@Inject("S3Client") private readonly storageClient: S3Client) {
    }

    onModuleDestroy(): void {
        this.storageClient.destroy();
    }

    async getObject(pathToObject: string) {
        const command = new GetObjectCommand({Bucket: this.DEFAULT_BUCKET, Key: pathToObject});

        try {
            const response = await this.storageClient.send(command);
            if (!response) {
                return null;
            }

            return response.Body;
            // await response.Body.transformToString();
        } catch (err) {
            return null;
        }
    }

    async listObjects() {
        const command = new ListObjectsV2Command({
            Bucket: this.DEFAULT_BUCKET,
            // The default and maximum number of keys returned is 1000. This limits it to
            // one for demonstration purposes.
            MaxKeys: 10
        });

        try {
            let isTruncated = true;

            let contents = "";
            while (isTruncated) {
                const {Contents, IsTruncated, NextContinuationToken} = await this.storageClient.send(command);
                const contentsList = Contents?.map((c) => ` • ${c.Key}`).join("\n");
                contents += contentsList + "\n";
                isTruncated = !!IsTruncated;
                command.input.ContinuationToken = NextContinuationToken;
            }
            return contents;
        } catch (err) {
            return [];
        }
    }

    async putObject(objectName: string, file: Express.Multer.File) {
        const command = new PutObjectCommand({
            Bucket: this.DEFAULT_BUCKET,
            Key: objectName,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype
        });

        try {
            const response = await this.storageClient.send(command);
            return {success: true, data: response};
        } catch (err) {
            return {
                success: false,
                data: "Не удалось создать/изменить файл в хранилище.",
                err: err
            };
        }
    }

    async copyObject(outPath: string, pathTo: string) {
        const command = new CopyObjectCommand({
            CopySource: outPath,
            Bucket: this.DEFAULT_BUCKET,
            Key: pathTo
        });

        try {
            const response = await this.storageClient.send(command);
            return {success: true, data: response};
        } catch (err) {
            return {
                success: false,
                data: "Не удалось скопировать файл в хранилище.",
                err: err
            };
        }
    }

    async deleteObject(path: string) {
        const command = new DeleteObjectCommand({Bucket: this.DEFAULT_BUCKET, Key: path});

        try {
            const response = await this.storageClient.send(command);
            return {success: true, data: response};
        } catch (err) {
            return {
                success: false,
                data: "Не удалось удалить файл в хранилище.",
                err: err
            };
        }
    }

    async deleteObjects(paths: string[]) {
        const command = new DeleteObjectsCommand({
            Bucket: this.DEFAULT_BUCKET,
            Delete: {
                Objects: paths.map(path => ({Key: path}))
            }
        });

        try {
            const {Deleted} = await this.storageClient.send(command);
            return {
                code: 1,
                data: "Deleted objects: " + Deleted?.map((d) => ` • ${d.Key}`).join("\n")
            };
        } catch (err) {
            return {code: 0, data: "Не удалось удалить объекты"};
        }
    }
}