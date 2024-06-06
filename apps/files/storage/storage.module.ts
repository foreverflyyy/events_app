import {Module} from '@nestjs/common';
import {StorageRepository} from './storage.repository';
import {storageS3Factory} from "./storage.factory";
import {StorageService} from "./storage.service";

@Module({
  providers: [
    storageS3Factory,
    StorageService,
    StorageRepository
  ],
  exports: [StorageService]
})

export class StorageModule {}