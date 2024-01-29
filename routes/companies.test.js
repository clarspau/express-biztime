/** Tests for companies */

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


// Test suite for GET request on the /companies endpoint
describe("GET /", function () {
     // Test case: It should respond with an array of companies
     test("It should respond with an array of companies", async function () {
          const response = await request(app).get("/companies");
          expect(response.body).toEqual({
               "companies": [
                    { code: "apple", name: "Apple" },
                    { code: "ibm", name: "IBM" },
               ],
          });
     });
});


// Test suite for GET requests on specific company endpoints
describe("GET /apple", function () {
     // Test case: It should return company info for Apple
     test("It return company info", async function () {
          const response = await request(app).get("/companies/apple");
          expect(response.body).toEqual({
               "company": {
                    code: "apple",
                    name: "Apple",
                    description: "Maker of OSX.",
                    invoices: [1, 2],
               },
          });
     });

     // Test case: It should return 404 for a non-existing company
     test("It should return 404 for no-such-company", async function () {
          const response = await request(app).get("/companies/blargh");
          expect(response.status).toEqual(404);
     });
});


// Test suite for POST requests to create a new company
describe("POST /", function () {
     // Test case: It should add a new company
     test("It should add a new company", async function () {
          const response = await request(app)
               .post("/companies")
               .send({ name: "TacoTime", description: "Yum!" });

          expect(response.body).toEqual({
               "company": {
                    code: "tacotime",
                    name: "TacoTime",
                    description: "Yum!",
               },
          });
     });

     // Test case: It should return 500 for a conflict (duplicate company)
     test("It should return 500 for conflict", async function () {
          const response = await request(app)
               .post("/companies")
               .send({ name: "Apple", description: "Huh?" });

          expect(response.status).toEqual(500);
     });
});


// Test suite for PUT requests to update an existing company
describe("PUT /", function () {
     // Test case: It should update an existing company (Apple)
     test("It should update an existing company", async function () {
          const response = await request(app)
               .put("/companies/apple")
               .send({ name: "AppleEdit", description: "NewDescrip" });

          expect(response.body).toEqual({
               "company": {
                    code: "apple",
                    name: "AppleEdit",
                    description: "NewDescrip",
               },
          });
     });

     // Test case: It should return 404 for a non-existing company
     test("It should return 404 for no-such-comp", async function () {
          const response = await request(app)
               .put("/companies/blargh")
               .send({ name: "Blargh" });

          expect(response.status).toEqual(404);
     });

     // Test case: It should return 500 for missing data in the request
     test("It should return 500 for missing data", async function () {
          const response = await request(app)
               .put("/companies/apple")
               .send({});

          expect(response.status).toEqual(500);
     });
});


// Test suite for DELETE requests to delete a company
describe("DELETE /", function () {
     // Test case: It should delete an existing company (Apple)
     test("It should delete an existing company", async function () {
          const response = await request(app).delete("/companies/apple");
          expect(response.body).toEqual({ "status": "deleted" });
     });

     // Test case: It should return 404 for a non-existing company
     test("It should return 404 for no-such-comp", async function () {
          const response = await request(app).delete("/companies/blahblah");
          expect(response.status).toEqual(404);
     });
});
