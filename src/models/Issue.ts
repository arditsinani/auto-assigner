import { Document, Schema } from 'mongoose';

/**
 * @interface IssueBaseModel
 * @description basic interface for issue model
 */
 export interface IssueBaseModel {
    creator: string,
    description: string,
    isAssigned: boolean,
    assignedTo: string,
    agentDescription?: string,
    isProcessed: boolean
}

/**
 * @interface IIssue
 * @description interface for issue model
 */
export interface IIssue extends IssueBaseModel, Document {}

/**
 * @schema Issue
 * @description mongoose issue schema
 */
const Issue = new Schema<IIssue>({
    id: Schema.Types.ObjectId,
    creator: { type: String, required: true },
    description: { type: String, required: true },
    isAssigned: { type: Boolean },
    assignedTo: { type: String },
    agentDescription: { type: String },
    isProcessed: { type: Boolean }
}, { collection: 'issues', _id: true, timestamps: true })

export default Issue
