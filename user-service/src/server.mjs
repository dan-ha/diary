import server from './app';

server.listen(
    process.env.PORT_PROD ? process.env.PORT_PROD : process.env.PORT,
    process.env.REST_LISTEN ? process.env.REST_LISTEN : "localhost",
    () => {
        console.log(server.name + ' listening at ' + server.url);
    });

export default server;
