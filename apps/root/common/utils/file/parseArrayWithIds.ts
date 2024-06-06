import {getObjectId} from "../index";
import {InternalServerErrorException} from "@nestjs/common";

export default (data: string[] | string) => {
    try {
        if (!data) return [];

        if (!Array.isArray(data)) {
            data = data.split(",");
        }

        return data.reduce((acc: string[], element: string) => {
            const id = getObjectId(element.trim());
            if (id) acc.push(String(id));
            return acc;
        }, []);
    } catch (err) {
        throw new InternalServerErrorException({
            code: 0,
            data: "Не удалось привести к массиву переданные данные."
        });
    }
};