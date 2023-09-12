const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite = require("sqlite3");
const app = express();
app.listen(3000);
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDbAndServer();

//get all cricketers profiles
app.get("/cricketers", async (request, response) => {
  const query = `SELECT * FROM CRICKET_TEAM;`;
  const cricketTeam = await db.all(query);
  response.send(cricketTeam);
});

//get cricketer profile
app.get("/cricketer/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    console.log(playerId);
    const query = `SELECT * FROM CRICKET_TEAM WHERE PLAYER_ID = ${playerId};`;
    const result = await db.get(query);
    console.log(result);
    response.send(result);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});

//add Cricketer
app.post("/addCricketer/", async (request, response) => {
  const cricketerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = cricketerDetails;
  const query = `INSERT INTO CRICKET_TEAM
    (player_id,player_name,jersey_number,role)
    VALUES
     (${playerId},'${playerName}',
    ${jerseyNumber},'${role}');`;

  const result = db.run(query);
  response.send(result.lastID);
});

app.put("/cricketer/update/:playerId/", async (request, response) => {
  try {
    const cricketerDetails = request.body;
    const { playerId } = request.params;
    const { playerName, jerseyNumber, role } = cricketerDetails;
    const query = `UPDATE CRICKET_TEAM SET PLAYER_NAME='${playerName}',
  JERSEY_NUMBER=${jerseyNumber} ,ROLE='${role}' WHERE PLAYER_ID=${playerId};`;

    const result = await db.run(query);
    response.send("Updated successfully");
  } catch (e) {
    console.log(e.message);
  }
});

app.delete("/cricketer/delete/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const query = `DELETE FROM CRICKET_TEAM WHERE PLAYER_ID=${playerId};`;

    const result = await db.run(query);
    response.send("deleted successfully");
  } catch (e) {
    console.log(e.message);
  }
});
