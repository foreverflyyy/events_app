import {Module} from '@nestjs/common';
import {AchievementsController, AgeLimitsController, CategoriesController} from "./controllers";
import {AchievementsService, AgeLimitsService, CategoriesService} from "./services";

@Module({
    controllers: [
        AchievementsController,
        AgeLimitsController,
        CategoriesController
    ],
    providers: [
        AchievementsService,
        AgeLimitsService,
        CategoriesService
    ]
})
export class EditModule {
}