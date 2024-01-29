/** routes for the companies */

const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();


/** GET / - returns `{companies: [companyData, ...]}` */

router.get("/", async function (req, res, next) {
     try {
          const result = await db.query(
               `SELECT code, name 
               FROM companies 
               ORDER BY name`
          );

          return res.json({ "companies": result.rows });
     } catch (err) {
          return next(err);
     }
});


/** GET /[code] - return data about one company: `{company: companyData, invoices: [invoiceData, ...]}` */

router.get("/:code", async function (req, res, next) {
     try {
          let code = req.params.code;

          const compResult = await db.query(
               `SELECT code, name, description 
               FROM companies
               WHERE code = $1`,
               [code]
          );

          const invResult = await db.query(
               `SELECT id
               FROM invoices
               WHERE comp_code = $1`,
               [code]
          );

          if (compResult.rows.length === 0) {
               throw new ExpressError(` There is no company with code '${code}`, 404);
          }

          const company = compResult.rows[0];
          const invoices = invResult.rows;

          company.invoices = invoices.map(inv => inv.id);

          return res.json({ "company": company });
     } catch (err) {
          return enxt(err);
     }
});


/** POST / - create company from data; return `{company: companyData}` */

router.post("/", async function (req, res, next) {
     try {
          let { name, description } = req.body;
          let code = name.toLowerCase().replace(/\s+/g, '-');

          const result = await db.query(
               `INSERT INTO companies (code, name, description)
               VALUES ($1, $2, $3)
               RETURNING code, name, description`,
               [code, name, description]
          );

          return res.status(201).json({ "company": result.rows[0] });
     } catch (err) {
          return next(err);
     }
});


/** PUT /[code] - update fields in companies; return `{company: companyData}` */

router.put("/:code", async function (req, res, next) {
     try {
          let { name, description } = req.body;
          let code = req.params.code;

          const result = await db.query(
               `UPDATE companies
               SET name=$1, description=$2
               WHERE code=$3
               RETURNING code, name, description`,
               [name, description, code]
          );

          if (result.rows.length === 0) {
               throw new ExpressError(`There is no company: '${code}`, 404);
          } else {
               return res.json({ "company": result.rows[0] });
          }
     } catch (err) {
          return next(err);
     }
});


/** DELETE /[code] - delete company, return `{status: "deleted"}` */

router.delete("/:code", async function (req, res, next) {
     try {
          let code = req.params.code;

          const result = await db.query(
               `DELETE FROM companies
               WHERE code=$1
               RETURNING code`,
               [code]
          );

          if (result.rows.length == 0) {
               throw new ExpressError(`There is no company: '${code}`, 404);
          } else {
               return res.json({ "status": "deleted" });
          }
     } catch (err) {
          return enxt(err);
     }
});


module.exports = router;