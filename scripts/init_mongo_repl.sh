#!/bin/bash
echo "SLEEPING"
sleep 10
echo "INITIALIZING CENTRAL DATA REPLICATION"
mongosh <<EOF
disableTelemetry()
var config = {
  "_id": "mongoSet",
  "members": [
      { "_id": 0, "host": "mongodbmain:27017" },
      { "_id": 1, "host": "mongodb2:27017" },
      { "_id": 2, "host": "mongodb3:27017" }
  ]
};
rs.initiate(config, {
    force: true
});
rs.status();

use admin;
db.createUser({
  user: 'admin',
  pwd: 'admin123654789',
  roles: [ { role: "root", db: "admin" } ]
});
EOF