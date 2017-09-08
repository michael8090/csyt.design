const Koa = require('koa');
const koaStatic = require('koa-static');
const path = require('path')

const app = new Koa();
const port = 3000;

app.use(koaStatic('build/client/'));

app.listen(port, () => {
  console.log(`server is started on port ${port}`);
});
