import server from './app';

server.listen(process.env.PORT, () => {
    console.log(server.name + ' listening at ' + server.url);
});

export default server;
