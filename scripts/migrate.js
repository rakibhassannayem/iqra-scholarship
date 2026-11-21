const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:1234@localhost:5432/iqra-scholarship",
});

async function run() {
  try {
    console.log("Connecting to database...");
    await pool.query("SELECT 1");
    console.log("Database connected successfully!");

    console.log("Applying column additions to scholarship_categories...");
    await pool.query(
      "ALTER TABLE scholarship_categories ADD COLUMN IF NOT EXISTS min_marks integer;",
    );
    await pool.query(
      "ALTER TABLE scholarship_categories ADD COLUMN IF NOT EXISTS max_marks integer;",
    );
    console.log("Columns min_marks and max_marks added successfully!");

    console.log("Creating results table if not exists...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS results (
        id serial PRIMARY KEY NOT NULL,
        student_id integer NOT NULL REFERENCES students(id) ON DELETE cascade,
        scholarship_id integer NOT NULL REFERENCES scholarships(id) ON DELETE cascade,
        marks integer NOT NULL,
        category_id integer REFERENCES scholarship_categories(id) ON DELETE set null,
        status varchar(30) DEFAULT 'not-awarded' NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS student_scholarship_result_unique 
      ON results(student_id, scholarship_id);
    `);
    console.log("Results table and unique index created successfully!");

    console.log("Migration finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
