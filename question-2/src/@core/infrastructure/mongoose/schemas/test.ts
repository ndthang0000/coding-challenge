import { HydratedDocument, model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TestDocument = HydratedDocument<Test>;

export interface ITestModel {
    data: string;
    createdDate: Date;
    updatedDate: Date;
}

@Schema()
export class Test implements ITestModel {
    @Prop(String)
    data: string;

    @Prop()
    createdDate: Date;

    @Prop()
    updatedDate: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);

export const TestModel = model<Test>('Test', TestSchema);
