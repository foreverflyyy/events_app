import {TypeCollection} from "../../enums";
import {getFullPathImage} from "./imagePathActions";
import {EntityWithImages} from "../../types";
import {EventModel} from "../../models";
import {EventRequestEntity} from "../../../database/entities";

export const parseRecordsWithImages = (records: EntityWithImages[], collection: TypeCollection) => {
    return records.map((record: EntityWithImages) => {
            if (collection === TypeCollection.Events) {
                record = record as EventModel;
                const needId = String(record._id);

                record = {
                    ...record,
                    mainImage: getFullPathImage(needId, collection, record.mainImage),
                    images: record.images?.map((image: string) => getFullPathImage(needId, collection, image)),
                    participants: record.participants?.map((participant: any) => {
                        return {
                            ...participant,
                            mainImage: getFullPathImage(needId, TypeCollection.Users, participant.mainImage)
                        };
                    }),
                    organizers: record.organizers?.map((organizer: any) => {
                        return {
                            ...organizer,
                            mainImage: getFullPathImage(needId, TypeCollection.Users, organizer.mainImage)
                        };
                    })
                };
            }

            if (collection === TypeCollection.EventRequests) {
                record = record as EventRequestEntity;
                const needId = String(record.eventId);

                record = {
                    ...record,
                    mainImage: getFullPathImage(needId, TypeCollection.Events, record.mainImage),
                    images: record.images?.map((image: string) =>
                        getFullPathImage(needId, TypeCollection.Events, image)),
                    organizers: record.organizers?.map((organizer: any) => {
                        return {
                            ...organizer,
                            mainImage: getFullPathImage(needId, TypeCollection.Users, organizer.mainImage)
                        };
                    })
                };
            }

            return record;
        }
    );
};