/**
 * ================================================================================
 * MOCK PROJECT PDF VERIFICATION TOOL
 * ================================================================================
 *
 * PURPOSE:
 * This script verifies that all projects in the database have corresponding
 * PDF files. It provides a comprehensive report of PDF availability and helps
 * identify missing PDFs that need to be generated.
 *
 * WHEN TO USE:
 * - After loading new mock project data
 * - Before deploying/releasing code
 * - Troubleshooting PDF download issues
 * - Regular maintenance checks
 * - After running PDF generation scripts
 *
 * USAGE:
 *
 * 1. From project root:
 *    npm run verify-mock-pdfs
 *
 * 2. From server directory:
 *    npm run verify-mock-pdfs
 *
 * 3. Directly (from server/server/database/test_data/utilities):
 *    node verify_mock_pdfs.js
 *
 * BEHAVIOR:
 * - Queries database for all projects
 * - Checks for existence of corresponding PDF files
 * - Provides detailed report with project IDs and PDF status
 * - Shows summary statistics
 * - Suggests next steps if PDFs are missing
 *
 * REQUIREMENTS:
 * - Database must be accessible
 * - Node.js and database dependencies
 *
 * OUTPUT EXAMPLE:
 * ✓ PDF exists for project: 1_groweasy
 * ✗ PDF missing for project: 2_smartspark
 *
 * SUMMARY:
 * Total projects: 12
 * PDFs found: 11
 * PDFs missing: 1
 *
 * NEXT STEPS:
 * If PDFs are missing, this script will suggest appropriate actions:
 * - Run generate_mock_pdfs.js for missing PDFs
 * - Check database connection if no projects found
 * - Verify file permissions if PDFs should exist
 *
 * ================================================================================
 */

const fs = require("fs");
const path = require("path");

// Import database dependencies (relative to utilities directory)
const DBHandler = require("../db");
const DB_CONFIG = require("../db_config");

const db = new DBHandler();

/**
 * Verify PDF files for all projects in the database
 * @returns {Promise} Resolves when verification is complete
 */
async function verifyProjectPDFs() {
  try {
    console.log("=".repeat(60));
    console.log("MOCK PROJECT PDF VERIFICATION");
    console.log("=".repeat(60));
    console.log("Verifying PDF files for all projects...");
    console.log("");

    // Fetch all projects from database
    const projects = await db.selectAll(DB_CONFIG.tableNames.senior_projects);

    console.log(`Found ${projects.length} projects in database`);
    console.log("");

    if (projects.length === 0) {
      console.log("No projects found in database.");
      console.log("");
      console.log("Possible reasons:");
      console.log("   1. Test data not loaded");
      console.log("   2. Database connection issue");
      console.log("   3. Empty database");
      console.log("");
      console.log("To fix:");
      console.log(
        "   1. Load test data: node -e \"require('../../../db_setup.js')()\"",
      );
      console.log("   2. Or run SQL scripts manually");
      console.log("   3. Check database connection");
      return;
    }

    // Navigate from utilities to proposal_docs directory
    const proposalDocsPath = path.join(__dirname, "../../../proposal_docs/");
    let missingPDFs = [];
    let existingPDFs = [];

    console.log("Checking PDF files:");
    console.log("-".repeat(50));

    // Check each project for PDF file
    for (const project of projects) {
      const pdfPath = path.join(proposalDocsPath, `${project.project_id}.pdf`);

      if (fs.existsSync(pdfPath)) {
        existingPDFs.push(project.project_id);
        console.log(`PDF exists for project: ${project.project_id}`);
      } else {
        missingPDFs.push(project.project_id);
        console.log(`PDF missing for project: ${project.project_id}`);
      }
    }

    console.log("");
    console.log("=".repeat(60));
    console.log("VERIFICATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total projects: ${projects.length}`);
    console.log(`PDFs found: ${existingPDFs.length}`);
    console.log(`PDFs missing: ${missingPDFs.length}`);
    console.log(
      `Coverage: ${Math.round((existingPDFs.length / projects.length) * 100)}%`,
    );

    if (missingPDFs.length > 0) {
      console.log("");
      console.log("MISSING PDF FILES:");
      console.log("-".repeat(30));
      missingPDFs.forEach((projectId) => {
        console.log(`   • ${projectId}`);
      });

      console.log("");
      console.log("RECOMMENDED ACTIONS:");
      console.log("-".repeat(30));
      console.log("   1. Generate missing PDFs:");
      console.log("      npm run generate-mock-pdfs");
      console.log("");
      console.log("   2. Or generate PDFs directly:");
      console.log("      node generate_mock_pdfs.js");
      console.log("");
      console.log("   3. Force regenerate ALL PDFs:");
      console.log("      npm run force-regenerate-mock-pdfs");
    } else {
      console.log("");
      console.log("   ALL PROJECTS HAVE PDF FILES!");
      console.log("   Your mock data is complete and ready for use.");
      console.log("   Download buttons should work properly in the UI.");
    }

    console.log("=".repeat(60));
  } catch (error) {
    console.error("Error during PDF verification:", error);
    console.log("");
    console.log("Troubleshooting:");
    console.log("   1. Check database connection");
    console.log("   2. Ensure test data is loaded");
    console.log("   3. Verify file permissions");
    console.log("   4. Check server/server/proposal_docs/ directory exists");

    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  verifyProjectPDFs();
}

module.exports = { verifyProjectPDFs };
