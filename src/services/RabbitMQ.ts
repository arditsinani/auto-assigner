import { Channel, connect, Connection } from 'amqplib'
import config from './Config'

/**
 * @service
 * @description rabbitmq service
 */
class RabbitMQ {
    private connection: Connection
    private channel: Channel

    /**
     * @function
     * @description initialize rabbitmq
     */
    public async init(): Promise<void> {
        try {
            const conf = config.rabbitmq
            this.connection = await connect(conf.uri)
            this.channel = await this.connection.createChannel()
            await this._queuesResolver()
            console.log(`RabbitMQ Connected at: ${conf.uri}`)
        } catch (error) {
            console.log("error while connectiong to RabbitMQ")
            console.log(error)
        }
    }

    /**
     * @function
     * @returns current connection
     */
    public getConnection(): Connection {
        return this.connection
    }

    /**
     * @function
     * @returns current channel
     */
    public getChannel(): Channel {
        return this.channel
    }

    /**
     * @function
     * @description close current connection
     */
    public async close(): Promise<void> {
        return this.connection.close()
    }

    /**
     * @function
     * @description resolves all queues from config
     */
    private async _queuesResolver(): Promise<any> {
        const queues = config.rabbitmq.queues
        let promises = Object.keys(queues).map(queue => {
            this._assertQueue(queues[queue].name)
        })
        Promise.all(promises)
    }

    /**
     * @function
     * @param queue string
     * @description assert queue
     */
    private async _assertQueue(queue: string): Promise<void> {
        try {
            await this.channel.assertQueue(queue) 
        } catch (error) {
            console.log("error while asserting queue")
            console.log(error)
        }
    }

    /**
     * @function
     * @param queue string
     * @param msg any
     * @returns boolean
     * @description send message to queue
     */
    public publish(queue: string, msg: any): boolean {
        try {
            return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)))
        } catch (error) {
            console.log("error while sending message to queue")
            console.log(error)
            return false
        }
    }

    /**
     * @function
     * @param queue stirng
     * @returns string | null
     * @description consume a message from a queue
     */
    public async consume(queue: string): Promise<string | null> {
        try {
            return new Promise(async (resolve) => {
                let counts = await this.channel.checkQueue(queue)
                if (!counts.messageCount) {
                    return resolve(null)
                }
                this.channel.consume(queue, (msg) => {
                    return resolve(JSON.parse(msg?.content.toString() || ''))
                }, { noAck: true })
            })
        } catch (error) {
            console.log("error while receiving message from queue")
            console.log(error)
            return null
        }
    }
}

export default new RabbitMQ()