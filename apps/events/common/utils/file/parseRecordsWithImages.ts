import {TypeCollection} from "../../enums";
import {getFullPathImage} from "./imagePathActions";
import {ModelsWithImages} from "../../types";
import {Event, EventRequest} from "../../../database/schemas";

export const parseRecordsWithImages = (records: ModelsWithImages[], collection: TypeCollection) => {
    return records.map((record: ModelsWithImages) => {
            const id = String(record._id);

            if (collection === TypeCollection.Events) {
                record = record as Event;
                record = {
                    ...record,
                    mainImage: getFullPathImage(id, collection, record.mainImage),
                    images: record.images?.map((image: string) => getFullPathImage(id, collection, image)),
                    participants: (record as Event).participants?.map((participant: any) => {
                        return {
                            ...participant,
                            mainImage: getFullPathImage(id, TypeCollection.Users, participant.mainImage)
                        };
                    }),
                    organizers: record.organizers?.map((organizer: any) => {
                        return {
                            ...organizer,
                            mainImage: getFullPathImage(id, TypeCollection.Users, organizer.mainImage)
                        };
                    })
                };
            }

            if (collection === TypeCollection.EventRequests) {
                record = record as EventRequest;
                record = {
                    ...record,
                    mainImage: getFullPathImage(id, collection, record.mainImage),
                    images: record.images?.map((image: string) => getFullPathImage(id, collection, image)),
                    organizers: record.organizers?.map((organizer: any) => {
                        return {
                            ...organizer,
                            mainImage: getFullPathImage(id, TypeCollection.Users, organizer.mainImage)
                        };
                    })
                };
            }

            return record;
        }
    );
};