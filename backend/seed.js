const bcrypt = require('bcryptjs');
const sequelize = require('./src/utils/db');
const { User } = require('./src/models');

const seed = async () => {
  await sequelize.sync({ force: true });

  const password = await bcrypt.hash('user123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const volPassword = await bcrypt.hash('vol123', 10);

  await User.bulkCreate([
    {
      name: 'Priya Sharma',
      email: 'priya@email.com',
      password: password,
      role: 'user',
      goal: 'Weight Loss',
      height: 165,
      weight: 60,
    },
    {
      name: 'Admin Samanvaya',
      email: 'admin@samanvaya.com',
      password: adminPassword,
      role: 'admin',
    },
    {
      name: 'Volunteer Rahul',
      email: 'vol@email.com',
      password: volPassword,
      role: 'volunteer',
    },
  ]);

  console.log('Database seeded successfully!');
  process.exit();
};

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
