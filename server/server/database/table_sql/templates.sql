-- TODO: Create fields for question templates
CREATE TABLE eval_templete (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_title TEXT,
    question_HTML TEXT,
);

-- TODO: Create tables for coach feedback
--     - Team ID to get all team memmbers (check if they have all completed)
--     - Reference Peer Eval Action ID to link between coach and student action
--     - Reference Action Log with the Peer Eval Action ID to get currently completed
--     - Stores feedback table (student_id, feedback text, useAI)
--      TODO:  Create REFERENCES Table for peer evaluations
  