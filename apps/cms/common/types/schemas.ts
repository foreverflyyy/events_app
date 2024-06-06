import {AchievementModel, EventModel} from "../models";
import {EventRequestEntity} from "../../database/entities";

export type EntityWithMainImage = EventModel | AchievementModel | EventRequestEntity;
export type EntityWithExtraImages = EventModel | AchievementModel | EventRequestEntity;

export type EntityWithImages = EntityWithMainImage | EntityWithExtraImages;