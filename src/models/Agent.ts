import { Document, Schema } from 'mongoose';

/**
 * @interface AgentBaseModel
 * @description agent basic properties
 */
export interface AgentBaseModel {
    username: string,
    password: string,
    name?: string,
    surname?: string,
    age?: number,
    status: AgentStatus
}

export type AgentStatus = 'online' | 'offline'

/**
 * @interface IAgent
 * @description agent model
 */
export interface IAgent extends AgentBaseModel, Document {}

/**
 * @constant
 * agent mongoose schema
 */
const Agent = new Schema<IAgent>({
    id: Schema.Types.ObjectId,
    username: { type: String, unique: true, required: true, dropDups: true },
    password: { type: String, unique: true, required: true, dropDups: true },
    name: { type: String },
    surname: { type: String },
    age: { type: Number, min: 18 },
    status: { type: String, required: true }
}, { collection: 'agents', _id: true, timestamps: true })

export default Agent