/**
 * Script to force regenerate ALL PDFs for mock projects (overwrites existing PDFs)
 * This is useful when you need to update the PDF format or content for all projects
 * Might need to add to package.json in root and server to run this script easily
 */

const fs = require("fs");
const path = require("path");
const PDFDoc = require("pdfkit");
const he = require("he");
const { convert } = require("html-to-text");

// Import database dependencies
const DBHandler = require("./server/database/db");
const DB_CONFIG = require("./server/database/db_config");

const db = new DBHandler();

/**
 * Generate a PDF for a project (force overwrite)
 * @param {Object} project - Project data from database
 */
function generateProjectPDF(project) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDoc();
      const baseURL = path.join(__dirname, "server/proposal_docs/");

      // Ensure directory exists
      fs.mkdirSync(baseURL, { recursive: true });

      const pdfPath = `${baseURL}/${project.project_id}.pdf`;

      console.log(`Force regenerating PDF for project: ${project.project_id}`);

      doc.pipe(fs.createWriteStream(pdfPath));
      doc.font("Times-Roman");

      // Generate PDF content based on project proposal keys
      for (let key of Object.keys(DB_CONFIG.senior_project_proposal_keys)) {
        doc
          .fill("blue")
          .fontSize(16)
          .text(DB_CONFIG.senior_project_proposal_keys[key]);

        // Convert HTML entities and HTML to text, handle null/undefined values
        const fieldValue = project[key] || "Not specified";
        const cleanText = convert(he.decode(fieldValue.toString()));

        doc.fontSize(12).fill("black").text(cleanText);

        doc.moveDown();
      }

      // Add attachments section (if any)
      doc.fill("blue").fontSize(16).text("Attachments");

      const attachments = project.attachments || "No attachments";
      doc.fontSize(12).fill("black").text(attachments);
      doc.moveDown();

      doc.end();

      doc.on("end", () => {
        console.log(
          `✓ Force regenerated PDF for project: ${project.project_id}`,
        );
        resolve();
      });

      doc.on("error", (err) => {
        console.error(
          `✗ Error regenerating PDF for project ${project.project_id}:`,
          err,
        );
        reject(err);
      });
    } catch (error) {
      console.error(
        `✗ Error regenerating PDF for project ${project.project_id}:`,
        error,
      );
      reject(error);
    }
  });
}

/**
 * Main function to force regenerate PDFs for all projects
 */
async function forceRegenerateAllPDFs() {
  try {
    console.log("Force regenerating PDFs for all mock projects...");

    // Fetch all projects from database
    const projects = await db.selectAll(DB_CONFIG.tableNames.senior_projects);

    console.log(`Found ${projects.length} projects in database`);

    if (projects.length === 0) {
      console.log(
        "No projects found in database. Make sure test data is loaded.",
      );
      return;
    }

    // Generate PDFs for each project (force overwrite)
    for (const project of projects) {
      await generateProjectPDF(project);
    }

    console.log("✓ Completed force regeneration of PDFs for all projects!");
  } catch (error) {
    console.error("✗ Error during PDF regeneration:", error);
  }
}

// Run the script
if (require.main === module) {
  forceRegenerateAllPDFs();
}

module.exports = { forceRegenerateAllPDFs };
