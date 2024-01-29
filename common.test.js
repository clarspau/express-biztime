/** Common code shared among tests. */

// Import the database module
const db = require("./db");

// Function to create test data
async function createData() {
  // Clear existing data
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");

  // Reset the sequence for the 'invoices' table
  await db.query("SELECT setval('invoices_id_seq', 1, false)");

  // Insert test data into the 'companies' table
  await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES 
      ('apple', 'Apple', 'Maker of OSX.'),
      ('ibm', 'IBM', 'Big blue.')
  `);

  // Insert test data into the 'invoices' table and retrieve the IDs
  const inv = await db.query(`
    INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
    VALUES 
      ('apple', 100, false, '2018-01-01', null),
      ('apple', 200, true, '2018-02-01', '2018-02-02'), 
      ('ibm', 300, false, '2018-03-01', null)
    RETURNING id
  `);
}

// Export the createData function for use in other modules/tests
module.exports = { createData };
