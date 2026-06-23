import { Model, PopulateOptions, Types, UpdateQuery } from 'mongoose';

export interface IPaginate<T> {
    count: number;
    pageSize: number;
    pages: number;
    page: number;
    documents: T[];
}
export abstract class DataBaseRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) { }

    async findOne({
        filter,
        populate,
    }: {
        filter?: any;
        populate?: PopulateOptions[];
    }): Promise<TDocument | null> {
        const query = this.model.findOne(filter || {});

        if (populate && populate.length > 0) {
            query.populate(populate);
        }

        return await query.exec();
    }

    async create(data: Partial<TDocument>): Promise<TDocument> {
        return await this.model.create(data);
    }

    async find({
        filter,
        populate,
        page = 1,
        limit = 10,
        sort,
        select
    }: {
        filter?: any;
        populate?: PopulateOptions[];
        page?: number;
        limit?: number;
        sort?: string;
        select?: string;
    }): Promise<TDocument[] | [] | IPaginate<TDocument>> {
        const query = this.model.find(filter || {});

        if (populate && populate.length > 0) {
            await query.populate(populate);
        }

        if (sort) {
            sort = sort.replaceAll(',', ' ');
            await query.sort(sort);
        }

        if (select) {
            select = select.replaceAll(',', ' ');
            await query.select(select);
        }
        const skip = (page - 1) * limit;

        const count = await this.model.countDocuments(filter || []);
        const pages = Math.ceil(count / limit);
        const documents = await query.skip(skip).limit(limit).exec();

        return {
            count,
            pageSize: limit,
            pages,
            page,
            documents,
        };
    }

    async findById({
        id,
        populate,
    }: {
        id: Types.ObjectId;
        populate?: PopulateOptions[];
    }): Promise<TDocument | null> {
        const query = this.model.findById(id);

        if (populate && populate.length > 0) {
            query.populate(populate);
        }

        return await query.exec();
    }

    async updateOne({
        filter,
        data,
    }: {
        filter: any;
        data: UpdateQuery<TDocument>;
    }): Promise<boolean> {
        const result = await this.model.updateOne(filter, data).exec();
        return result.modifiedCount > 0;
    }

    async updateById({
        id,
        data,
    }: {
        id: Types.ObjectId;
        data: Partial<TDocument>;
    }): Promise<TDocument | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async deleteOne(filter: any): Promise<boolean> {
        const result = await this.model.deleteOne(filter).exec();
        return result.deletedCount > 0;
    }

    async deleteById(id: Types.ObjectId): Promise<boolean> {
        // using findByIdAndDelete is more idiomatic than constructing a filter
        // manually and mirrors the behaviour of the other update helpers.
        const result = await this.model.findByIdAndDelete(id).exec();
        return result != null;
    }

    async count(filter?: any): Promise<number> {
        return await this.model.countDocuments(filter || {}).exec();
    }

    async exists(filter: any): Promise<boolean> {
        // the `exists` helper returns null if no document matches and an object
        // with _id if one does.  this avoids using countDocuments with a limit,
        // which can trigger deprecation warnings in newer mongoose versions.
        const result = await this.model.exists(filter);
        return result != null;
    }
}