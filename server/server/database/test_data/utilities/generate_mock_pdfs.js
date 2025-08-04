/**
 * ================================================================================
 * MOCK PROJECT PDF GENERATOR
 * ================================================================================
 *
 * PURPOSE:
 * This script generates PDF files for mock projects that were inserted directly
 * into the database via SQL scripts, bypassing the normal project creation
 * process that includes PDF generation.
 *
 * PROBLEM SOLVED:
 * When mock data is loaded via test_data/*.sql files, the projects exist in the
 * database but lack corresponding PDF files. This causes "ENOENT" errors when
 * users try to download project PDFs via the download buttons in the UI.
 *
 * USAGE:
 *
 * 1. From project root:
 *    npm run generate-mock-pdfs
 *
 * 2. From server directory:
 *    npm run generate-mock-pdfs
 *
 * 3. Directly (from server/server/database/test_data/utilities):
 *    node generate_mock_pdfs.js
 *
 * BEHAVIOR:
 * - Queries database for all projects
 * - Generates PDF files for projects that don't already have PDFs
 * - Skips projects that already have PDF files (safe to run multiple times)
 * - PDFs are created in server/server/proposal_docs/ directory
 * - PDF format matches live project creation (blue titles, no underlines)
 *
 * REQUIREMENTS:
 * - Database must be populated with test data (run fill_test_data.sql first)
 * - Node.js dependencies: pdfkit, he, html-to-text
 * - Database connection working
 *
 * OUTPUT:
 * Creates PDF files named: {project_id}.pdf
 * Example: 1_groweasy.pdf, 2_smartspark.pdf, etc.
 *
 * MAINTENANCE:
 * - Run after loading new mock project data
 * - Safe to run during development/testing
 * - Does not overwrite existing PDFs (use force_regenerate_mock_pdfs.js for that)
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
 * Generate a PDF for a single project
 * @param {Object} project - Project data from database
 * @returns {Promise} Resolves when PDF is generated successfully
 */
function generateProjectPDF(project) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDoc();
      // Navigate from utilities to proposal_docs directory
      const baseURL = path.join(__dirname, "../../../proposal_docs/");

      // Ensure directory exists
      fs.mkdirSync(baseURL, { recursive: true });

      const pdfPath = `${baseURL}/${project.project_id}.pdf`;

      // Check if PDF already exists (skip to avoid overwriting)
      if (fs.existsSync(pdfPath)) {
        console.log(
          `PDF already exists for project ${project.project_id}, skipping...`,
        );
        resolve();
        return;
      }

      console.log(`Generating PDF for project: ${project.project_id}`);

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
        console.log(`Generated PDF for project: ${project.project_id}`);
        resolve();
      });

      doc.on("error", (err) => {
        console.error(
          `Error generating PDF for project ${project.project_id}:`,
          err,
        );
        reject(err);
      });
    } catch (error) {
      console.error(
        `Error generating PDF for project ${project.project_id}:`,
        error,
      );
      reject(error);
    }
  });
}

/**
 * Main function to generate PDFs for all mock projects
 * Only generates PDFs for projects that don't already have them
 */
async function generateAllMockPDFs() {
  try {
    console.log("=".repeat(60));
    console.log("MOCK PROJECT PDF GENERATOR");
    console.log("=".repeat(60));
    console.log("Starting PDF generation for mock projects...");

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

    let generatedCount = 0;
    let skippedCount = 0;

    // Generate PDFs for each project
    for (const project of projects) {
      const baseURL = path.join(__dirname, "../../../proposal_docs/");
      const pdfPath = `${baseURL}/${project.project_id}.pdf`;

      if (fs.existsSync(pdfPath)) {
        skippedCount++;
      } else {
        await generateProjectPDF(project);
        generatedCount++;
      }
    }

    console.log("=".repeat(60));
    console.log("SUMMARY:");
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   PDFs generated: ${generatedCount}`);
    console.log(`   PDFs skipped (already exist): ${skippedCount}`);
    console.log("=".repeat(60));
    console.log("Completed PDF generation for all projects!");
  } catch (error) {
    console.error("Error during PDF generation:", error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  generateAllMockPDFs();
}

module.exports = { generateAllMockPDFs };
