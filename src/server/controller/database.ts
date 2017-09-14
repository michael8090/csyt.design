import * as sqlite from 'sqlite';
import databaseUrl from '../data/data.sqlite';
import schemaSql from '../data/migrations/schema.sqlite.sql';
export async function test() {
    const db = await sqlite.open(databaseUrl, { verbose: true });
    await db.exec(schemaSql);
    console.log(await db.get('SELECT * from  tbl_post'));
    await db.close();
}
