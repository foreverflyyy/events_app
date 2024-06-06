import {TypeCollection} from "../../enums";
import {getFullPathImage} from "./imagePathActions";
import {EntityWithImages} from "../../types";
import {EventModel} from "../../common";

export const parseRecordsWithImages = (records: EntityWithImages[], collection: TypeCollection) => {
    return records.map((record: EntityWithImages) => {
            const id = String(record.id);

            if (collection === TypeCollection.Events) {
                record = record as EventModel;
                record = {
                    ...record,
                    mainImage: getFullPathImage(id, collection, record.mainImage),
                    images: record.images?.map((image: string) => getFullPathImage(id, collection, image)),
                    participants: record.participants?.map((participant: any) => {
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

            return record;
        }
    );
};