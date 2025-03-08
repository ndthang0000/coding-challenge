import { HydratedDocument, Model } from 'mongoose';
import { IEntity } from 'src/@core/domain/entities/Entity';
import IRepository from 'src/@core/domain/repositories/IRepository';
import EntityID from 'src/@core/domain/value-objects/EntityID';

export default abstract class Repository<E extends IEntity, IModel> implements IRepository<E> {
    protected readonly _model: Model<IModel, {}>;

    constructor(model: Model<IModel, {}>) {
        this._model = model;
    }

    protected abstract convertEntityToDocument(entity: E): HydratedDocument<IModel>;
    protected abstract convertDocumentToEntity(persist: HydratedDocument<IModel>): E;

    async add(entity: E): Promise<E> {
        const doc = this.convertEntityToDocument(entity);
        await this._model.create(doc);

        entity = this.convertDocumentToEntity(doc);
        return entity;
    }

    async delete(entity: E): Promise<E> {
        await this._model.findByIdAndDelete(entity.id?.value).exec();
        return entity;
    }

    async deleteById(id: EntityID): Promise<void> {
        this._model.findByIdAndDelete(id?.value).exec();
    }

    async update(entity: E): Promise<E> {
        const doc = await this._model.findById(entity.id?.value).exec();
        if (doc === null) throw new Error('doc not found ');

        doc.set(this.convertEntityToDocument(entity));
        await doc.save();

        return entity;
    }

    async findOneById(id: EntityID): Promise<E | null> {
        const doc = await this._model.findById(id?.value).exec();
        if (doc === null) return null;

        const entity = this.convertDocumentToEntity(doc);
        return entity;
    }

    async all(): Promise<E[]> {
        const docs = await this._model.find().exec();

        const entities = [];
        for (const doc of docs) {
            if (doc !== null) {
                const entity = this.convertDocumentToEntity(doc);
                entities.push(entity);
            }
        }

        return entities;
    }

    async multipleAdd(entities: E[]): Promise<E[]> {
        const docs = entities.map(entity => this.convertEntityToDocument(entity));
        // tslint:disable-next-line: no-empty
        await this._model.insertMany(docs, { ordered: false }).catch(err => {});

        entities = docs.map(doc => this.convertDocumentToEntity(doc));
        return entities;
    }

    async bulkSave(entities: E[]): Promise<E[]> {
        const docs = entities.map(entity => {
            const doc = this.convertEntityToDocument(entity);
            doc.isNew = false;
            return doc;
        });
        // tslint:disable-next-line: no-empty
        await this._model.bulkSave(docs, { ordered: false, bypassDocumentValidation: true }).catch(err => {
            console.log(err);
        });

        entities = docs.map(doc => this.convertDocumentToEntity(doc));
        return entities;
    }
}
