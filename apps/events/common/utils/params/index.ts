import {getObjectId} from "../index";

export const getValuesAndConditions = (values: string[]) => {
    const valuesIds = [];
    const conditionIds = [];
    for (const value of values) {
        const objectIdValue = getObjectId(value);
        if (!objectIdValue) {
            continue;
        }

        conditionIds.push({_id: objectIdValue});
        valuesIds.push(objectIdValue);
    }

    return {valuesIds, conditionIds};
};