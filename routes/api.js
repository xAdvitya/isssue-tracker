/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");

module.exports = function(app) {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  mongoose.connection.once("open", () => {
    console.log("MongoDB connected!");
  });

  const Schema = mongoose.Schema;

  const issueSchema = new Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    status_text: { type: String },
    open: { type: Boolean, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true }
  });

  const Issue = mongoose.model("Issue", issueSchema);

  app
    .route("/api/issues/:project")
    .get(function(req, res) {
      console.log(req.query);
      Issue.find(req.query, (err, data) => {
        if (err) {
          console.error(err);
        }
        res.json(data);
      });
    })

    .post(function(req, res) {
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
      let newIssue = {};
      if (!issue_title || !issue_text || !created_by) {
        res.send("missing inputs");
      } else {
        newIssue["issue_title"] = issue_title;
        newIssue["issue_text"] = issue_text;
        newIssue["created_by"] = created_by;
        newIssue["assigned_to"] = assigned_to;
        newIssue["status_text"] = status_text;
        newIssue["open"] = true;
        newIssue["created_on"] = Date.now();
        newIssue["updated_on"] = Date.now();
        newIssue = new Issue(newIssue);
        newIssue.save();
        //console.log(newIssue);
        res.json(newIssue);
      }
    })

    .put(function(req, res) {
      let updateIssue = req.body;

      let id = updateIssue._id;
      let title = updateIssue.issue_title;
      let text = updateIssue.issue_text;
      let created = updateIssue.created_by;
      let status = updateIssue.status_text;
      let assigned = updateIssue.assigned_to;

      Issue.findById(id, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database operation failed" });
        }

        if ("issue_title" in data) {
          data["issue_title"] = title;
        }
        if ("issue_text" in data) {
          data["issue_text"] = text;
        }
        if ("created_by" in data) {
          data["created_by"] = created;
        }
        if ("status_text" in data) {
          data["status_text"] = status;
        }
        if ("assigned_to" in data) {
          data["assigned_to"] = assigned;
        }
        if ("open" in data) {
          data["open"] = false;
        }
        data["updated_on"] = Date.now();
        data.save();
        res.json(data);
      });
    })

    .delete(function(req, res) {
      let deleteId = req.body._id;
      if (!deleteId) {
        res.send("no id");
      }
    else{
      Issue.remove({ _id: deleteId }, (err, done) => {
        if (err) {
          console.error(err);
        }
         res.send("deleted");  
      });
 
    }
  });
};
