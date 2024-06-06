import mongoose from "mongoose";
import {Injectable} from '@nestjs/common';
import {AddressRepository} from "../../database/repositories";
import {CreateAddressDto, UpdateAddressDto} from "../dto/address.dto";

@Injectable()
export class AddressService {
    constructor(
        private readonly addressRepository: AddressRepository
    ) {}

    getAddresses() {
        return this.addressRepository.find({});
    }

    getAddressById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.addressRepository.findOne({_id: id});
    }


    async createAddress(dto: CreateAddressDto) {
        return await this.addressRepository.create(dto);
    }

    updateAddress(id: string, dto: UpdateAddressDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.addressRepository.findOneAndUpdate({_id: id}, dto);
    }

    deleteAddress(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.addressRepository.deleteOne({_id: id});
    }
}