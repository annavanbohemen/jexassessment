const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;
const dbFile = "./database.sqlite3";
const db = new sqlite3.Database(dbFile);

//set cors to allow localhost
app.use(cors({ origin: "http://localhost:4200" }));

app.use(bodyParser.json());

// Initialize the database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Company (
      CompanyId INTEGER PRIMARY KEY AUTOINCREMENT,
      CompanyName TEXT NOT NULL,
      CompanyAddress TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Vacancy (
      VacancyId INTEGER PRIMARY KEY AUTOINCREMENT,
      CompanyId INTEGER,
      VacancyTitle TEXT NOT NULL,
      VacancyDescription TEXT NOT NULL,
      FOREIGN KEY (CompanyId) REFERENCES Company (CompanyId) ON DELETE CASCADE
    )
  `);

  // Clear the tables before inserting sample data (Optional)
  db.run(`DELETE FROM Vacancy`);
  db.run(`DELETE FROM Company`);

  // Insert sample Company
  db.run(`INSERT INTO Company (CompanyName, CompanyAddress) VALUES (?, ?)`, [
    "Tech Corp",
    "123 Tech Street",
  ]);
  db.run(`INSERT INTO Company (CompanyName, CompanyAddress) VALUES (?, ?)`, [
    "Business Solutions",
    "456 Business Ave",
  ]);
  db.run(`INSERT INTO Company (CompanyName, CompanyAddress) VALUES (?, ?)`, [
    "Innovative Labs",
    "789 Innovation Blvd",
  ]);
  db.run(`INSERT INTO Company (CompanyName, CompanyAddress) VALUES (?, ?)`, [
    "Creative Minds",
    "101 Creative Way",
  ]);
  db.run(`INSERT INTO Company (CompanyName, CompanyAddress) VALUES (?, ?)`, [
    "Future Ventures",
    "202 Future Road",
  ]);

  // Insert sample Vacancy
  db.run(
    `INSERT INTO Vacancy (companyId, VacancyTitle, VacancyDescription) VALUES (?, ?, ?)`,
    [1, "Software Engineer", "Develop and maintain software applications."]
  );
  db.run(
    `INSERT INTO Vacancy (companyId, VacancyTitle, VacancyDescription) VALUES (?, ?, ?)`,
    [1, "Product Manager", "Oversee product development and strategy."]
  );
  db.run(
    `INSERT INTO Vacancy (companyId, VacancyTitle, VacancyDescription) VALUES (?, ?, ?)`,
    [
      2,
      "Business Analyst",
      "Analyze business processes and recommend improvements.",
    ]
  );
  db.run(
    `INSERT INTO Vacancy (companyId, VacancyTitle, VacancyDescription) VALUES (?, ?, ?)`,
    [
      3,
      "Research Scientist",
      "Conduct research and experiments in innovative technology.",
    ]
  );
  db.run(
    `INSERT INTO Vacancy (companyId, VacancyTitle, VacancyDescription) VALUES (?, ?, ?)`,
    [3, "Lab Technician", "Support laboratory operations and experiments."]
  );
  // No Vacancies for 'Creative Minds' and 'Future Ventures' (companies 4 and 5)
});

// 1. Retrieve all companies with their vacancies
app.get("/companies", (req, res) => {
  const sql = `SELECT Company.CompanyId, Company.CompanyName, Company.CompanyAddress,
                 json_group_array(
                   json_object('VacancyId', Vacancy.VacancyId, 'VacancyTitle', Vacancy.VacancyTitle, 'VacancyDescription', Vacancy.VacancyDescription)
                 ) AS Vacancies
                 FROM Company
                 LEFT JOIN Vacancy ON Company.CompanyId = Vacancy.CompanyId
                 GROUP BY Company.CompanyId`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ companies: rows });
  });
});

// 2. Create a new company
app.post("/companies", (req, res) => {
  const { companyName, companyAddress } = req.body;
  const sql = `INSERT INTO Company (CompanyName, CompanyAddress) VALUES (?, ?)`;
  db.run(sql, [companyName, companyAddress], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ companyId: this.lastID });
  });
});

// 3. Update a company by ID
app.put("/companies/:id", (req, res) => {
  const { id } = req.params;
  const { companyName, companyAddress } = req.body;
  const sql = `UPDATE Company SET CompanyName = ?, CompanyAddress = ? WHERE CompanyId = ?`;
  db.run(sql, [companyName, companyAddress, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// 4. Delete a company by ID (will also delete related vacancies)
app.delete("/companies/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Company WHERE CompanyId = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// 5. Add a vacancy to a company
app.post("/companies/:id/vacancies", (req, res) => {
  const { id } = req.params;
  const { vacancyTitle, vacancyDescription } = req.body;
  const sql = `INSERT INTO Vacancy (CompanyId, VacancyTitle, VacancyDescription) VALUES (?, ?, ?)`;
  db.run(sql, [id, vacancyTitle, vacancyDescription], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ vacancyId: this.lastID });
  });
});

// 6. Update a vacancy by ID
app.put("/vacancies/:id", (req, res) => {
  const { id } = req.params;
  const { vacancyTitle, vacancyDescription } = req.body;
  const sql = `UPDATE Vacancy SET VacancyTitle = ?, VacancyDescription = ? WHERE VacancyId = ?`;
  db.run(sql, [vacancyTitle, vacancyDescription, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// 7. Delete a vacancy by ID
app.delete("/vacancies/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Vacancy WHERE VacancyId = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
