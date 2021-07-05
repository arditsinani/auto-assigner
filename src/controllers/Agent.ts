import mongo from '../services/Mongo'
import { badRequest, Boom, notFound } from '@hapi/boom'
import { Request } from '@hapi/hapi'
import { AgentBaseModel, AgentStatus, IAgent } from '../models/Agent'
import RabbitMQ from '../services/RabbitMQ'
import { IIssue, IssueBaseModel } from '../models/Issue'

/**
 * @controller
 * @description Agent model controller
 */
class Agent {
    /**
     * @function
     * @param request 
     * @returns all agents
     */
    public async get(request: Request): Promise<Array<AgentBaseModel>> {
        try {
            let model = mongo.getModel("agent")
            return model.find()
        } catch (error) {
            throw new Boom(error)
        }
    }

    /**
     * @function
     * @param request
     * @description update status for a free agent
     */
    public async updateStatus(request: Request): Promise<any> {
        try {
            const id: string = request.params.id
            let agentModel = mongo.getModel("agent")
            let issueModel = mongo.getModel("issue")
            let agent: IAgent = await agentModel.findById(id) as IAgent
            if (!agent) {
                return notFound("Agent not found")
            }
            const message: Partial<IssueBaseModel> = await RabbitMQ.consume('issue') as Partial<IssueBaseModel>
            if (!message) {
                return 'No issues to process, agent going offline'
            } else {
                const issue: Partial<IssueBaseModel> = {
                    creator: message.creator,
                    description: message.description,
                    isAssigned: true,
                    assignedTo: agent._id as string,
                    isProcessed: false
                }
                await issueModel.create(issue)
                let status: AgentStatus = 'online'
                await agentModel.findByIdAndUpdate(id, { $set: { status } })
                agent.status = status
                return agent
            }
        } catch (error) {
            throw new Boom(error)
        }
    }

    /**
     * @function
     * @param request 
     * @description resolve an issue related to an agent
     */
    public async resolveIssue(request: Request): Promise<any> {
        try {
            const id: string = request.params.id
            const issueId: string = request.params.issueId
            if (!mongo.isValidObjectId(id) || !mongo.isValidObjectId(issueId)) {
                return badRequest("Invalid agent or issue id")
            }
            let agentModel = mongo.getModel("agent")
            let issueModel = mongo.getModel("issue")
            let agent: IAgent = await agentModel.findById(id) as IAgent
            let issue: IIssue = await issueModel.findById(issueId) as IIssue
            if (!agent || !issue) {
                return notFound("Agent or Issue not found")
            } else if (issue.isProcessed) {
                return badRequest("Issue is already resolved")
            } else if (agent._id != issue.assignedTo) {
                return badRequest("Issue is not related to this agent")
            } else {
                const updateAgentPaylod: Partial<AgentBaseModel> = { 
                    status: 'offline' 
                }
                const updateIssuePayload: Partial<IssueBaseModel> = {
                    isProcessed: true
                }
                const updateAgentPromise = agentModel.findByIdAndUpdate(id, { $set: updateAgentPaylod })
                const updateIssuePromise = issueModel.findByIdAndUpdate(issueId, { $set: updateIssuePayload })
                await Promise.all([
                    updateAgentPromise,
                    updateIssuePromise
                ])
                return 'Issue updated successfully'
            }
        } catch (error) {
            throw new Boom(error)
        }
    }

}

export default new Agent()