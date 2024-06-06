import {AchievementModel, EventModel} from "../common";

export type EntityWithMainImage = EventModel | AchievementModel;
export type EntityWithExtraImages = EventModel | AchievementModel;

export type EntityWithImages = EntityWithMainImage | EntityWithExtraImages;