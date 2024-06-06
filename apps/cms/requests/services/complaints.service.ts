import mongoose from "mongoose";
import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ComplaintEntity} from "../../database/entities";

@Injectable()
export class ComplaintsService {
    constructor(
        @InjectRepository(ComplaintEntity) private complaintsRepository: Repository<ComplaintEntity>
    ) {
    }

    async parsedComplaints(complaints: ComplaintEntity[]) {
        const parsedComplaints: any[] = [];
        // for (const complaint of complaints) {
        //     let {author, target} = complaint;
        //
        //     const foundAuthor = (await this.userRepository.findByIdsShortInfo([author]))[0];
        //
        //     const needRepository = this.allRepositories[type as TypeCollection];
        //     const foundRecipient = (await needRepository?.findByIdsShortInfo([target]))[0];
        //     parsedComplaints.push({
        //         ...complaint,
        //         author: foundAuthor,
        //         target: foundRecipient
        //     });
        // }

        return parsedComplaints;
    }

    async getComplaints() {
        const needRecords = await this.complaintsRepository.find({});
        return await this.parsedComplaints(needRecords);
    }

    async getComplaintById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        const foundRecord = await this.complaintsRepository.findOne({
            where: {id: id}
        });
        return foundRecord
            ? (await this.parsedComplaints([foundRecord]))[0]
            : foundRecord;
    }

    async noticeViewed(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        await this.complaintsRepository.update(
            {id: id},
            {isViewed: true}
        );
    }

    deleteComplaint(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.complaintsRepository.delete({id: id});
    }
}
