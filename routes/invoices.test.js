/** Tests for invoices. */

// Importing necessary modules and dependencies
const request = require("supertest");
const app = require("../app");
const { createData } = require("../common.test.js");
const db = require("../db");

// Before each test, clean out data using the createData function
beforeEach(createData);

// After all tests are done, close the database connection
afterAll(async () => {
     await db.end();
});

// Test suite for GET request on the /invoices endpoint
describe("GET /", function () {
     // Test case: It should respond with an array of invoices
     test("It should respond with an array of invoices", async function () {
          const response = await request(app).get("/invoices");
          expect(response.body).toEqual({
               "invoices": [
                    { id: 1, comp_code: "apple" },
                    { id: 2, comp_code: "apple" },
                    { id: 3, comp_code: "ibm" },
               ],
          });
     });
});

// Test suite for GET requests on specific invoice endpoints
describe("GET /1", function () {
     // Test case: It should return invoice info for invoice with id 1
     test("It return invoice info", async function () {
          const response = await request(app).get("/invoices/1");
          expect(response.body).toEqual({
               "invoice": {
                    id: 1,
                    amt: 100,
                    add_date: expect.any(String), // Expecting a date string
                    paid: false,
                    paid_date: null,
                    company: {
                         code: 'apple',
                         name: 'Apple',
                         description: 'Maker of OSX.',
                    },
               },
          });
     });

     // Test case: It should return 404 for a non-existing invoice
     test("It should return 404 for no-such-invoice", async function () {
          const response = await request(app).get("/invoices/999");
          expect(response.status).toEqual(404);
     });
});

// Test suite for POST requests to create a new invoice
describe("POST /", function () {
     // Test case: It should add a new invoice
     test("It should add a new invoice", async function () {
          const response = await request(app)
               .post("/invoices")
               .send({ amt: 400, comp_code: 'ibm' });

          expect(response.body).toEqual({
               "invoice": {
                    id: 4,
                    comp_code: "ibm",
                    amt: 400,
                    add_date: expect.any(String), // Expecting a date string
                    paid: false,
                    paid_date: null,
               },
          });
     });
});

// Test suite for PUT requests to update an existing invoice
describe("PUT /", function () {
     // Test case: It should update an existing invoice with id 1
     test("It should update an existing invoice", async function () {
          const response = await request(app)
               .put("/invoices/1")
               .send({ amt: 1000, paid: false });

          expect(response.body).toEqual({
               "invoice": {
                    id: 1,
                    comp_code: 'apple',
                    paid: false,
                    amt: 1000,
                    add_date: expect.any(String), // Expecting a date string
                    paid_date: null,
               },
          });
     });

     // Test case: It should return 404 for a non-existing invoice
     test("It should return 404 for no-such-invoice", async function () {
          const response = await request(app)
               .put("/invoices/9999")
               .send({ amt: 1000 });

          expect(response.status).toEqual(404);
     });

     // Test case: It should return 500 for missing data in the request
     test("It should return 500 for missing data", async function () {
          const response = await request(app)
               .put("/invoices/1")
               .send({});

          expect(response.status).toEqual(500);
     });
});

// Test suite for DELETE requests to delete an invoice
describe("DELETE /", function () {
     // Test case: It should delete an existing invoice with id 1
     test("It should delete an existing invoice", async function () {
          const response = await request(app)
               .delete("/invoices/1");

          expect(response.body).toEqual({ "status": "deleted" });
     });

     // Test case: It should return 404 for a non-existing invoice
     test("It should return 404 for no-such-invoice", async function () {
          const response = await request(app)
               .delete("/invoices/999");

          expect(response.status).toEqual(404);
     });
});
