const UserAuth = require("./user_auth");
const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

let key = process.env.GOOGLE_API_KEY;

// Windows for some reason adds a double quote around Environment Variables
if (key?.startsWith('"')) {
  key = key.slice(1, -1);
}

const genAI = new GoogleGenerativeAI(key);

const PROMPT_GENERATE_FEEDBACK_SUMMARY = `You are an writing assistant that is providing a student their project performance based upon their peer's feedback
Summarize and anonymize the following peer review feedback from a student project. 
In JSON format, You'll be given categorized feedback for a student from their team members.
Create a  anonymized paragraph that captures the key points and overall sentiment of the feedback. 

Input Specification:
    Will be in Json With this format:
    {
        Student: "Student context is for",
        Ratings: {
            From: "Student Feedback is From",
            Feedback: {
                "Category": "Feedback entered in form"
            }
        }
    }  

Output Specification: 
    1. Do not include any names or identifying information. (Do not say you can not reveal names either)
    2. Focus on providing constructive insights that the student can use to improve their performance. 
    3. The summary should be concise, typically 3-5 sentences, highlighting strengths and areas for improvement. 
    4. Output should be in paragraph form.   
    5. Speak in the POV as the team coach talking to the student
`;

const PROMPT_GENERATE_FEEDBACK_COMPLETION = `You are a writing assistant providing a student their project performance based upon their peer's feedback. Summarize and anonymize the following peer review feedback from a student project. 
In JSON format, you'll be given categorized feedback for a student from their team members. Create an anonymized paragraph that captures the key points and overall sentiment of the feedback.

Input Specification:
    Will be in this format:
    Student Feedback:
    {
        Student: "Student context is for",
        Ratings: {
            From: "Student Feedback is From",
            Feedback: {
                "Category": "Feedback entered in form"
            }
        },
    }
    Current Coach Feedback:
    Text typed in...

Output Specification:
    1. Do not include any names or identifying information. 
    2. Focus on providing constructive insights that the student can use to improve their performance. 
    3. The summary should be concise, typically 3-5 sentences, highlighting strengths and areas for improvement. 
    4. Output should be in paragraph form.
    5. Continue the current text logically, adding up to two more sentences to complete the thought.
    6. Speak in the POV as the team coach talking to the student.
`;

const PROMPT_GENERATE_HISTORIC_SUMMARY = `You are a writing assistant that provides a historical performance summary for a student based on their peer reviews over time.
Summarize and chronicle the evolution of the student's performance, highlighting key improvements and recurring challenges.

Input Specification:
    The input will be a JSON array of review objects representing the student's past evaluations.
    Each review will contain a timestamp, reviewer identity, and structured feedback.

    The input format will be:
    [
        {
            "submission_datetime": "Timestamp of review submission",
            "form_data": "{\\"Students\\":{\\"Student Name\\":{\\"Feedback\\":{\\"Category\\":\\"Feedback entered in form\\"},\\"Ratings\\":{\\"Category\\":Numeric Rating}}}}"
        },
        ...
    ]

    - form_data contains feedback categories and ratings for the student.
    - Each review is submitted at a different time, allowing trends to be analyzed.

Output Specification:
    1. Focus on trends and changes over time.
    2. Identify key improvements and recurring challenges in performance.
    3. The summary should be a comprehensive paragraph written in a reflecting historical performance.  
`;


const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction: PROMPT_GENERATE_FEEDBACK_SUMMARY,
});

const completionModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction: PROMPT_GENERATE_FEEDBACK_COMPLETION,
});

const historicModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction: PROMPT_GENERATE_HISTORIC_SUMMARY,
});

async function provide_summary(studentFeedback) {
  try {
    const context = `${studentFeedback}`;
    const result = await model.generateContent(context);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

async function provide_historic_summary(studentFeedback) {
  try {
    const context = `${studentFeedback}`;
    const result = await historicModel.generateContent(context);
    return result.response.text();
  } catch (error) {
    console.error("Error generating historic content:", error);
  }
}

async function generateResponse(prompt, context) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: `Prompt: ${prompt}\n\nContext: ${JSON.stringify(context)}` }
          ]
        }
      ]
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate response.");
  }
}

module.exports = () => {
  router.post("/GenerateSummary", [UserAuth.isCoachOrAdmin], (req, res, next) => {
    const context = req.body.context;

    provide_summary(context)
      .then((response) => {
        res.type("text/plain");
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
          error.statusCode = 500;
          error.message = "Error generating summary with gemini-1.5-flash-latest";
          return next(error);
      });
  });

  router.post("/GenerateHistoricSummary", [UserAuth.isCoachOrAdmin], (req, res, next) => {
    const context = req.body.context;
  
    provide_historic_summary(context)
      .then((response) => {
        res.type("text/plain");
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        error.message = "Error generating historic summary";
        return next(error);
      });
  });

  router.post("/GenerateResponse", [UserAuth.isCoachOrAdmin], async (req, res, next) => {
    if (!key || key === "ADD_KEY_HERE") {
      res.type("text/plain");
      return res.status(200).send("Invalid API key. Please let an admin know.");
    }

    const { prompt, context } = req.body;

    if (!prompt || !context) {
      return res.status(200).json({ error: "Missing 'prompt' or 'context' in request body." });
    }

    generateResponse(prompt, context)
      .then((response) => {
        res.type("text/plain");
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error("Error generating response:", err);
        const error = new Error(err);
        error.statusCode = 500;
        error.message = "Error generating summary with gemini-1.5-flash-latest";
        return next(error);
      });
    });
  

  return router;
};
