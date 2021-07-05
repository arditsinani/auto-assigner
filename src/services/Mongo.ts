import { connect, Mongoose, Model, Schema, Types } from 'mongoose'
import Models from '../models';
import config from './Config'

/**
 * @service
 * @description mongodb resolver
 */
class Mongo {
    private client: Mongoose;
    private _models: { [index: string]: Model<any> };
    private _schemes:  { [index: string]: Schema<any> };

    /**
     * @function
     * @description initialize database model and indexes
     */
    public async init(): Promise<void> {
        try {
            const conf = config.mongo
            this.client = await connect(conf['uri'], { 
                useNewUrlParser: true, 
                useUnifiedTopology: true, 
                useFindAndModify: true, 
                useCreateIndex:true 
            })
            this._schemes = this._modelResolver();
            // load models
            Object.keys(this._schemes).forEach( async (name) => {
              const model = this.client.model(name, this._schemes[name]);
              await model.syncIndexes();
            });
            this._models = this.client.models;
            console.log(`Mongodb Connected at: ${conf['uri']}`)
        } catch (error) {
            console.log("error while connecting to mongo")
            console.log(error)
        }
    }

    /**
     * @function
     * @description close client connection
     */
    public async close(): Promise<void> {
        await this.client.disconnect()
    }

    /**
     * @function
     * @param model 
     * @returns model
     */
    public getModel(model: string): any {
        if (!this._models[model]) {
            throw new Error("model not found") 
        }
        return this._models[model]
    }

    /**
     * @function
     * @returns models
     */
    private _modelResolver(): any {
        const models = Models
        return models
    }

    /**
     * @function
     * @returns current client
     */
    public getClient(): Mongoose {
        return this.client
    }

    /**
     * @function
     * @param id 
     * @description check if id is a valid mongodb id
     */
    public isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id)
    }
}

export default new Mongo()