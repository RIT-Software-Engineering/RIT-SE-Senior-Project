const fs = require("fs");
const path = require("path");
const PDFDoc = require("pdfkit");
const he = require("he");
const { convert } = require("html-to-text");
const { nanoid } = require("nanoid");
const moment = require("moment");
const DB_CONFIG = require("../database/db_config");
const CONFIG = require("../config/config");

/**
 * Get list of proposal PDF file names
 */
const getProposalPdfNames = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, "../proposal_docs"), function (err, files) {
      if (err) {
        reject(err);
        return;
      }
      let fileLinks = [];
      files.forEach(function (file) {
        fileLinks.push(file.toString());
      });
      resolve(fileLinks);
    });
  });
};

/**
 * Get proposal PDF file
 */
const getProposalPdf = (projectId) => {
  return new Promise((resolve, reject) => {
    if (projectId) {
      let safeProjectId = projectId.replace(/\\|\//g, "");
      const filePath = path.join(
        __dirname,
        `../proposal_docs/${safeProjectId}.pdf`,
      );
      resolve(filePath);
    } else {
      reject(new Error("File not found"));
    }
  });
};

/**
 * Get list of proposal attachment file names
 */
const getProposalAttachmentNames = (projectId) => {
  return new Promise((resolve, reject) => {
    if (projectId) {
      let safeProjectId = projectId.replace(/\\|\//g, "");
      fs.readdir(
        path.join(
          __dirname,
          `./server/sponsor_proposal_files/${safeProjectId}`,
        ),
        function (err, files) {
          if (err) {
            reject(err);
            return;
          }
          let fileLinks = [];
          files.forEach(function (file) {
            fileLinks.push(file.toString());
          });
          resolve(fileLinks);
        },
      );
    } else {
      reject(new Error("Bad request"));
    }
  });
};

/**
 * Get proposal attachment file
 */
const getProposalAttachment = (projectId, fileName) => {
  return new Promise((resolve, reject) => {
    if (projectId && fileName) {
      let safeProjectId = projectId.replace(/\\|\//g, "");
      let safeName = fileName.replace(/\\|\//g, "");
      const filePath = path.join(
        __dirname,
        `../sponsor_proposal_files/${safeProjectId}/${safeName}`,
      );
      resolve(filePath);
    } else {
      reject(new Error("File not found"));
    }
  });
};

/**
 * Submit a new proposal
 */
const submitProposal = (db, body, files) => {
  return new Promise((resolve, reject) => {
    let date = new Date();
    let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
    const projectId = `${timeString}_${nanoid()}`;

    let filenamesCSV = "";
    // Attachment Handling
    if (files && files.attachments) {
      // If there is only one attachment, then it does not come as a list
      if (files.attachments.length === undefined) {
        files.attachments = [files.attachments];
      }

      if (files.attachments.length > 5) {
        reject(new Error("Maximum of 5 files allowed"));
        return;
      }

      const baseURL = path.join(
        __dirname,
        `../sponsor_proposal_files/${projectId}`,
      );

      fs.mkdirSync(baseURL, { recursive: true });

      for (let x = 0; x < files.attachments.length; x++) {
        if (files.attachments[x].size > 15 * 1024 * 1024) {
          // 15mb limit exceeded
          reject(new Error("File size limit exceeded"));
          return;
        }
        if (
          !CONFIG.accepted_file_types.includes(
            path.extname(files.attachments[x].name),
          )
        ) {
          reject(new Error("file type not accepted"));
          return;
        }

        // Append the file name to the CSV string, begin with a comma if x is not 0
        filenamesCSV +=
          x === 0
            ? `${files.attachments[x].name}`
            : `, ${files.attachments[x].name}`;

        files.attachments[x].mv(
          `${baseURL}/${files.attachments[x].name}`,
          function (err) {
            if (err) {
              reject(err);
            }
          },
        );
      }
    }

    const sql = `INSERT INTO ${DB_CONFIG.tableNames.senior_projects}
      (project_id, status, title, organization, primary_contact, contact_email, contact_phone, attachments,
      background_info, project_description, project_scope, project_challenges,
      sponsor_provided_resources, constraints_assumptions, sponsor_deliverables,
      proprietary_info, sponsor_alternate_time, sponsor_avail_checked, project_agreements_checked, assignment_of_rights)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
      projectId,
      "submitted",
      body.title.substring(0, 50),
      body.organization,
      body.primary_contact,
      body.contact_email,
      body.contact_phone,
      filenamesCSV,
      body.background_info,
      body.project_description,
      body.project_scope,
      body.project_challenges,
      body.sponsor_provided_resources,
      body.constraints_assumptions,
      body.sponsor_deliverables,
      body.proprietary_info,
      body.sponsor_alternate_time,
      body.sponsor_avail_checked,
      body.project_agreements_checked,
      body.assignment_of_rights,
    ];

    db.query(sql, params)
      .then(() => {
        // Generate PDF
        let doc = new PDFDoc();
        const baseURL = path.join(__dirname, `../proposal_docs/`);
        fs.mkdirSync(baseURL, { recursive: true });
        doc.pipe(fs.createWriteStream(`${baseURL}/${projectId}.pdf`));

        doc.font("Times-Roman");

        for (let key of Object.keys(DB_CONFIG.senior_project_proposal_keys)) {
          doc
            .fill("blue")
            .fontSize(16)
            .text(DB_CONFIG.senior_project_proposal_keys[key]),
            {
              underline: true,
            };
          doc
            .fontSize(12)
            .fill("black")
            .text(convert(he.decode(body[key] || "")));
          doc.moveDown();
          doc.save();
        }

        doc.fill("blue").fontSize(16).text("Attachments"),
          {
            underline: true,
          };
        doc.fontSize(12).fill("black").text(filenamesCSV);
        doc.moveDown();
        doc.save();

        doc.end();
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getProposalPdfNames,
  getProposalPdf,
  getProposalAttachmentNames,
  getProposalAttachment,
  submitProposal,
};
