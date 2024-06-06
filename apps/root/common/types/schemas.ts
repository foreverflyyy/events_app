import {Achievement, Event, News, User} from "../../database/schemas";

export type EntityWithMainImage = Event | User | Achievement;
export type EntityWithExtraImages = Event | News;

export type EntityWithImages = EntityWithMainImage | EntityWithExtraImages;