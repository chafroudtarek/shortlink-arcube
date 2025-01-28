// db.createUser({
//   user: process.env.MONG0_DB_USER,
//   pwd: process.env.MONG0_DB_PASSWORD,
//   roles: [
//     {
//       role: 'readWrite',
//       db: process.env.DATABASE_NAME,
//     },
//   ],
// });

db.createUser({
  user: 'admin',
  pwd: 'admin123654789',
  roles: [
    {
      role: 'root',
      db: 'admin',
    },
  ],
});
