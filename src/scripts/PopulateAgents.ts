import { AgentBaseModel } from '../models/Agent'
import mongo from '../services/Mongo'

const init = async () => {
    try {
        // connect to mongo
        await mongo.init()
        const agents: Array<AgentBaseModel> = [{
            username: "agent1",
            password: "agent1",
            name: "name",
            surname: "surname",
            age: 30,
            status: 'offline'
        },{
            username: "agent2",
            password: "agent2",
            name: "name",
            surname: "surname",
            age: 28,
            status: 'offline'
        },{
            username: "agent3",
            password: "agent3",
            name: "name",
            surname: "surname",
            age: 29,
            status: 'offline'
        }]
        let model = await mongo.getModel("agent")
        await model.create(agents)
        console.log("Agents populated")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

init()