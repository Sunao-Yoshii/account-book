const common = require("./DBCommon");

function createTable() {
  const db = common.DBCommon.get();
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run(
          `create table if not exists AmountHistory (
            id integer primary key AUTOINCREMENT,
            investment_id integer not null,
            check_at date not null,
            amount integer not null,
            stocks integer default null,
            foreign key (investment_id) references Investment(id)
          )`
        )
      });
      return resolve();
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
}

exports.InitAmountHistory = createTable;
