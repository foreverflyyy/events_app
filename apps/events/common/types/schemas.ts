import {Event, EventRequest} from "../../database/schemas";

export type ModelWithMainImage = Event | EventRequest;
export type ModelWithExtraImages = Event | EventRequest;

export type ModelsWithImages = ModelWithMainImage | ModelWithExtraImages;