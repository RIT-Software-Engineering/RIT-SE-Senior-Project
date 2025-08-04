/**
 * ================================================================================
 * FORCE REGENERATE MOCK PROJECT PDFS
 * ================================================================================
 *
 * PURPOSE:
 * This script force regenerates ALL PDF files for mock projects, overwriting
 * any existing PDFs. Use this when you need to update the PDF format or content
 * for all projects at once.
 *
 * WHEN TO USE:
 * - PDF format has changed and you need to update all existing PDFs
 * - PDF generation logic has been updated
 * - Need to ensure all PDFs use the latest formatting
 * - Troubleshooting PDF content issues
 *
 * DIFFERENCE FROM generate_mock_pdfs.js:
 * - generate_mock_pdfs.js: Only creates PDFs for projects that don't have them
 * - force_regenerate_mock_pdfs.js: Overwrites ALL PDFs, even existing ones
 *
 * USAGE:
 *
 * 1. From project root:
 *    npm run force-regenerate-mock-pdfs
 *
 * 2. From server directory:
 *    npm run force-regenerate-mock-pdfs
 *
 * 3. Directly (from server/server/database/test_data/utilities):
 *    node force_regenerate_mock_pdfs.js
 *
 * WARNING:
 * This script will OVERWRITE existing PDF files. Make sure this is what you want
 * before running. Use generate_mock_pdfs.js for safer operation that preserves
 * existing PDFs.
 *
 * BEHAVIOR:
 * - Queries database for all projects
 * - Generates PDF files for ALL projects (overwrites existing files)
 * - PDFs are created in server/server/proposal_docs/ directory
 * - PDF format matches live project creation (blue titles, no underlines)
 *
 * REQUIREMENTS:
 * - Database must be populated with test data (run fill_test_data.sql first)
 * - Node.js dependencies: pdfkit, he, html-to-text
 * - Database connection working
 *
 * OUTPUT:
 * Creates/overwrites PDF files named: {project_id}.pdf
 * Example: 1_groweasy.pdf, 2_smartspark.pdf, etc.
 *
 * MAINTENANCE:
 * - Run when PDF format changes
 * - Use sparingly in production environments
 * - Always backup existing PDFs if they contain important data
 *
 * ================================================================================
 */

const fs = require("fs");
const path = require("path");
const PDFDoc = require("pdfkit");
const he = require("he");
const { convert } = require("html-to-text");

// Import database dependencies (relative to utilities directory)
const DBHandler = require("../db");
const DB_CONFIG = require("../db_config");

const db = new DBHandler();

/**
 * Force generate a PDF for a single project (overwrites existing)
 * @param {Object} project - Project data from database
 * @returns {Promise} Resolves when PDF is generated successfully
 */
function forceGenerateProjectPDF(project) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDoc();
      // Navigate from utilities to proposal_docs directory
      const baseURL = path.join(__dirname, "../../../proposal_docs/");

      // Ensure directory exists
      fs.mkdirSync(baseURL, { recursive: true });

      const pdfPath = `${baseURL}/${project.project_id}.pdf`;

      console.log(
        `🔄 Force regenerating PDF for project: ${project.project_id}`,
      );

      doc.pipe(fs.createWriteStream(pdfPath));
      doc.font("Times-Roman");

      // Generate PDF content based on project proposal keys
      for (let key of Object.keys(DB_CONFIG.senior_project_proposal_keys)) {
        // Blue title without underline (matches live PDF generation)
        doc
          .fill("blue")
          .fontSize(16)
          .text(DB_CONFIG.senior_project_proposal_keys[key]);

        // Convert HTML entities and HTML to text, handle null/undefined values
        const fieldValue = project[key] || "Not specified";
        const cleanText = convert(he.decode(fieldValue.toString()));

        // Black content text
        doc.fontSize(12).fill("black").text(cleanText);

        doc.moveDown();
      }

      // Add attachments section
      doc.fill("blue").fontSize(16).text("Attachments");

      const attachments = project.attachments || "No attachments";
      doc.fontSize(12).fill("black").text(attachments);
      doc.moveDown();

      doc.end();

      doc.on("end", () => {
        console.log(`Force regenerated PDF for project: ${project.project_id}`);
        resolve();
      });

      doc.on("error", (err) => {
        console.error(
          `Error regenerating PDF for project ${project.project_id}:`,
          err,
        );
        reject(err);
      });
    } catch (error) {
      console.error(
        `Error regenerating PDF for project ${project.project_id}:`,
        error,
      );
      reject(error);
    }
  });
}

/**
 * Main function to force regenerate PDFs for all mock projects
 * Overwrites ALL existing PDFs
 */
async function forceRegenerateAllMockPDFs() {
  try {
    console.log("=".repeat(70));
    console.log("FORCE REGENERATE MOCK PROJECT PDFS");
    console.log("=".repeat(70));
    console.log("WARNING: This will OVERWRITE all existing PDF files!");
    console.log("");

    // Add a small delay to allow user to cancel if running interactively
    console.log("Starting force regeneration in 3 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fetch all projects from database
    const projects = await db.selectAll(DB_CONFIG.tableNames.senior_projects);

    console.log(`Found ${projects.length} projects in database`);

    if (projects.length === 0) {
      console.log("No projects found in database.");
      console.log("   Make sure test data is loaded by running:");
      console.log(
        "   1. From server directory: node -e \"require('./db_setup.js')()\"",
      );
      console.log("   2. Or load test data manually via SQL scripts");
      return;
    }

    console.log("Force regenerating PDFs for all projects...");

    // Force generate PDFs for each project
    for (const project of projects) {
      await forceGenerateProjectPDF(project);
    }

    console.log("=".repeat(70));
    console.log("SUMMARY:");
    console.log(`   Total projects processed: ${projects.length}`);
    console.log(`   PDFs force regenerated: ${projects.length}`);
    console.log("=".repeat(70));
    console.log("Completed force regeneration of PDFs for all projects!");
  } catch (error) {
    console.error("Error during PDF force regeneration:", error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  forceRegenerateAllMockPDFs();
}

module.exports = { forceRegenerateAllMockPDFs };
