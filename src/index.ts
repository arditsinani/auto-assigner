import { server } from '@hapi/hapi'
import routes from './routes/index'
import mongo from './services/Mongo'
import rabbitmq from './services/RabbitMQ'
import config from './services/Config'

const init = async () => {
    // connect to mongo
    await mongo.init()
    // connect to rabbitmq
    await rabbitmq.init()
    // server config
    const Server = server({
        port: config.server.port,
        host: config.server.host,
        routes: { 
            cors: {
                credentials: true,
                origin: ['*']
            }
        },
        debug: {
            request: ['error', 'uncaught']
        } 
    });
    // set /api prefix for all routes
    Server.realm.modifiers.route.prefix = '/api'
    // set routes
    Server.route(routes)
    // log server requests
    Server.events.on('response', function (request) {
        console.log(`${request.method.toUpperCase()} ${request.path} ${request.raw.res.statusCode} ${request.raw.res.statusMessage}`);
    });
    // start server
    await Server.start();
    console.log('Server running on %s', Server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    mongo.close()
    rabbitmq.close()
    process.exit(1);
});

init();