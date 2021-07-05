import { Boom, badRequest } from '@hapi/boom'
import { IssueBaseModel } from '../models/Issue'
import { Request } from '@hapi/hapi'
import RabbitMQ from '../services/RabbitMQ'

class Issue {
    /**
     * @function async
     * @param request 
     * @description create issue
     */
     async create(request: Request): Promise<{ published: boolean }> {
        try {
            const issue: IssueBaseModel = request.payload as IssueBaseModel
            issue.isAssigned = false
            issue.isProcessed = false
            let published = RabbitMQ.publish('issue', issue)
            return {
                published
            }
        } catch (error) {
            if (error.isBoom) {
                throw badRequest(error.details[0].message)
            }
            throw new Boom(error)
        }
    }

}

export default new Issue()
