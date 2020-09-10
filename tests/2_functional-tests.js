/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  var id;
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.property(
            res.body,
            "created_on",
            "created_on property missing"
          );
          assert.property(
            res.body,
            "updated_on",
            "updated_on property missing"
          );
          assert.property(
            res.body,
            "issue_title",
            "issue_title property missing"
          );
          assert.property(
            res.body,
            "created_by",
            "created_by property missing"
          );
          assert.property(
            res.body,
            "assigned_to",
            "assigned_to propery missing"
          );
          assert.property(
            res.body,
            "issue_text",
            "issue_text property missing"
          );
          assert.property(
            res.body,
            "status_text",
            "status_text property missing"
          );
          assert.property(res.body, "_id", "_id property missing");

          assert.equal(res.status, 200);
          assert.equal(
            res.body.issue_title,
            "Title",
            "expected ${res.body} to equal Title"
          );
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in",
            "expected ${res.body.created_by} to equal Functional Test"
          );
          assert.equal(
            res.body.assigned_to,
            "Chai and Mocha",
            "expected ${res.body.assigned_to} to equal Chai and Mocha"
          );
          assert.equal(
            res.body.status_text,
            "In QA",
            "expected ${res.body.status_text} to equal In QA"
          );
          assert.equal(
            res.body.open,
            true,
            "expected ${res.body.open} to be true"
          );
          id = res.body._id;
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in"
        })
        .end(function(err, res) {
          assert.property(
            res.body,
            "issue_title",
            "issue_title property missing"
          );
          assert.property(
            res.body,
            "created_by",
            "created_by property missing"
          );
          assert.property(
            res.body,
            "issue_text",
            "issue_text property missing"
          );

          assert.equal(res.status, 200);
          assert.equal(
            res.body.issue_title,
            "Title",
            "expected ${res.body} to equal Title"
          );
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in",
            "expected ${res.body.created_by} to equal Functional Test"
          );
          assert.equal(
            res.body.issue_text,
            "text",
            "expected ${res.body.issue_text} to equal In QA"
          );

          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({ issue_title: "heloo" })
        .end((err, res) => {
          assert.equal(res.text, "missing inputs", "missing error");
        });
      done();
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.equal(res.text, "missing inputs", "something");
        });
      done();
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: id, issue_title: "Title" })
        .end((err, res) => {
          assert.equal(res.body.issue_title, "Title", "issue with one update");
        });
      done();
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: id, issue_title: "Title", assigned_to: "Chai and Mocha" })
        .end((err, res) => {
          assert.equal(res.body.issue_title, "Title", "issue with one update");
          assert.equal(
            res.body.assigned_to,
            "Chai and Mocha",
            "expected ${res.body.assigned_to} to equal Chai and Mocha"
          );
        });
      done();
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            // console.log("/////////////////////////")
            // console.log(res.body)
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ assigned_to: "Chai and Mocha" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ assigned_to: "Chai and Mocha", open: true })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No_id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .query({})
        .end(function(err, res) {
          assert.equal(res.text, "no id", "issue with id");
          done();
        });
    });

  
    test("Valid _id", function(done) {
      console.log( ` id : ${id}`)
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({_id:id})
        .end(function(err, res) {
        assert.equal(res.text,"deleted","error in delete")
          done();
        });
    });
  });
});
