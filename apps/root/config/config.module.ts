import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {AchievementsController, AgeLimitsController, CategoriesController, TagsController} from "./controllers";
import {AchievementsService, AgeLimitsService, CategoriesService, TagsService} from "./services";
import {
  AchievementsRepository,
  AgeLimitsRepository,
  CategoriesRepository,
  TagsRepository
} from "../database/repositories";
import {
  Achievement,
  AchievementSchema,
  AgeLimit,
  AgeLimitSchema,
  Category,
  CategorySchema,
  Tag,
  TagSchema
} from "../database/schemas";

@Module({
    imports: [
        MongooseModule.forFeature([
          {name: Tag.name, schema: TagSchema},
          {name: Category.name, schema: CategorySchema},
          {name: Achievement.name, schema: AchievementSchema},
          {name: AgeLimit.name, schema: AgeLimitSchema}
        ])
    ],
    controllers: [
        AchievementsController,
        CategoriesController,
        TagsController,
        AgeLimitsController
    ],
    providers: [
        AchievementsService, AchievementsRepository,
        CategoriesService, CategoriesRepository,
        TagsService, TagsRepository,
        AgeLimitsService, AgeLimitsRepository
    ]
})
export class ConfigCommonModule {
}