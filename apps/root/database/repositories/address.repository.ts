import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AbstractRepository} from './abstract.repository';

import {Address} from "../schemas";

@Injectable()
export class AddressRepository extends AbstractRepository<Address> {
    constructor(@InjectModel(Address.name) private addressModel: Model<Address>) {
        super(addressModel);
    }
}