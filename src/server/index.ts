import Koa from 'koa';
import koaStatic from 'koa-static';
import path from 'path';
import { test } from './controller/database';
import './global.ts';

const app = new Koa();
const port = 3000;

app.use(koaStatic(path.resolve(__dirname, '../client/')));

app.listen(port, () => {
    console.log(`server is started on port ${port}`);
    test();
});
