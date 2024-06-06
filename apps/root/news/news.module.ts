import {Module} from '@nestjs/common';
import {NewsController} from './news.controller';
import {NewsService} from './news.service';
import {MongooseModule} from "@nestjs/mongoose";
import {News, NewsSchema} from "apps/root/database/schemas";
import {NewsRepository} from "apps/root/database/repositories";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema }
    ])
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository]
})

export class NewsModule {}