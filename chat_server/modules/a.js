let { runSql, queryPromise } = require('./dbTools');
(async () => {
    await runSql(`CREATE TABLE "main"."message" ("id"  INTEGER NOT NULL,"msg"  TEXT,"create_time"  TEXT,"to_who"  TEXT,"from_who"  TEXT,PRIMARY KEY ("id"));`);
    console.log(123);
})();

