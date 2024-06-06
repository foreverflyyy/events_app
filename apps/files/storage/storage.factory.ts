import { FactoryProvider } from '@nestjs/common';
import {S3Client} from "@aws-sdk/client-s3";

export const storageS3Factory: FactoryProvider = {
  provide: "S3Client",
  useFactory: () => {
    return new S3Client({
      // apiVersion: 'latest',
      endpoint: 'https://s3.timeweb.cloud',
      region: 'ru-1',
      credentials: {
        accessKeyId: 'VOXE0SXILQNPK9TZ8C01',
        secretAccessKey: 'rQ7murMWlUqc5PTzsQXxHAbpNNowBz6AhQ4L5GCC'
      }
    });
  }
};