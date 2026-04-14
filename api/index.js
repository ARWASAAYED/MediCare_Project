import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
// Use the router with path to db.json
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom route rewriting if needed (e.g., /api/users -> /users)
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));

server.use(router);

export default server;
