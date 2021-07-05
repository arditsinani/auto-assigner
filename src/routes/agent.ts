import Agent from '../controllers/Agent'
import { object, string } from 'joi'
import { Boom } from '@hapi/boom'

// normaly those server routes should be private
// but they are public since this is an open app
export default [
    {
        method: 'GET',
        path: '/agent/get',
        config: {
            description: 'get agents',
            tags: ['api', 'agent', 'get'],
            handler: Agent.get
        },
    },
    {
        method: 'POST',
        path: '/agent/{id}/update/status',
        config: {
            description: 'update agent status',
            tags: ['api', 'agent', 'update', 'status'],
            handler: Agent.updateStatus,
            validate: {
                params: object({
                    id: string().required().description('aggent id'),
                }).required(),
                failAction: (request, h, err) => {
                    return new Boom(err)
                },
            },
        },
    },
    {
        method: 'POST',
        path: '/agent/{id}/issue/{issueId}/resolve',
        config: {
            description: 'agent resolve issue',
            tags: ['api', 'agent', 'issue', 'resolve'],
            handler: Agent.resolveIssue,
            validate: {
                params: object({
                    id: string().required().description('aggent id'),
                    issueId: string().required().description('issue id'),
                }).required(),
                failAction: (request, h, err) => {
                    return new Boom(err)
                },
            },
        },
    }
]