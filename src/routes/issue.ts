import Issue from '../controllers/Issue'
import { object, string } from 'joi'
import { Boom } from '@hapi/boom'

export default [
    {
        method: 'POST',
        path: '/issue/create',
        config: {
            description: 'create issue',
            tags: ['api', 'issue', 'create'],
            handler: Issue.create,
            validate: {
                payload: object({
                    creator: string().required().description('issue reported'),
                    description: string().required().description('issue description')
                }).required(),
                failAction: (request, h, err) => {
                    return new Boom(err)
                },
            },
        },
    },
]