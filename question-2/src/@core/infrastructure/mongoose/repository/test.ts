import { Injectable } from '@nestjs/common';
import Test from 'src/@core/domain/entities/Test';
import Repository from './repository';
import ITestRepository from 'src/@core/domain/repositories/ITestRepository';
import { Model } from 'mongoose';
import EntityID from 'src/@core/domain/value-objects/EntityID';
import { InjectModel } from '@nestjs/mongoose';
import { ITestModel, TestDocument, TestModel } from '../schemas/test';

@Injectable()
export default class TestRepository extends Repository<Test, ITestModel> implements ITestRepository {
    public constructor(@InjectModel(Test.name) testModel: Model<ITestModel>) {
        super(testModel);
    }

    protected convertDocumentToEntity(persist: TestDocument): Test {
        const { _id, ...props } = persist.toObject();

        const entity = Test.create(
            {
                data: props.data,
                createdDate: props.createdDate,
                updatedDate: props.updatedDate,
            },

            EntityID.create({ value: _id.toString() }),
        );

        return entity;
    }

    protected convertEntityToDocument(entity: Test): TestDocument {
        const document = {
            _id: entity.id?.value,
            data: entity.data,
            createdDate: entity.createdDate || new Date(),
            updatedDate: entity.updatedDate || new Date(),
        };

        const persist = new TestModel(document);

        return persist;
    }
}
