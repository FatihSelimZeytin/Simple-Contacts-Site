const { SequelizeStorage, Umzug } = require('umzug');
const sequelize = require('./config/database');

const umzug = new Umzug({
    migrations: {
        glob: 'migrations/*.js',
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

async function migrate() {
    await umzug.up();
    console.log('✅ Migrations applied');
}

migrate().catch(err => {
    console.error('❌ Migration error:', err);
    process.exit(1);
});
