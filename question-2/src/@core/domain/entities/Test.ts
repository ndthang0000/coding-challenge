import Entity from './entity';
import EntityID from '../value-objects/EntityID';

export interface ITest {
    data: string;
    createdDate?: Date;
    updatedDate?: Date;
}

export default class Test extends Entity<ITest> {
    public static create(props: ITest, id?: EntityID) {
        return new Test(props, id);
    }

    get createdDate() {
        return this.props.createdDate;
    }

    get updatedDate() {
        return this.props.updatedDate;
    }

    get data() {
        return this.props.data;
    }
}
