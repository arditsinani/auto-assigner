import config from "config"

class Config {
    private getConfig(key: string): any {
        return config.has(key) ? config.get(key) : {}
    }

    public get mongo(): Object {
        return this.getConfig("mongo")
    }

    public get server(): { [key: string]: any } {
        return this.getConfig("server")
    }

    public get rabbitmq(): { [key: string]: any } {
        return this.getConfig("rabbitmq")
    }
}

export default new Config()
