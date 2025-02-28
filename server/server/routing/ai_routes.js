const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { log } = require("../logger");

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
    The input will be a JSON array of review objects (with extraneous metadata removed) representing the student's past evaluations.
Output Specification:
    1. Do not include any names or identifying information.
    2. Focus on trends and changes over time.
    3. The summary should be a comprehensive paragraph summarizing the historical performance in a coach's voice.
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

module.exports = () => {
  router.post("/GenerateSummary", (req, res) => {
    const context = req.body.context;
    log(context)

    provide_summary(context)
      .then((response) => {
        res.type("text/plain");
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post("/GenerateHistoricSummary", (req, res) => {
    const context = req.body.context;
    log(context);

    provide_historic_summary(context)
      .then((response) => {
        res.type("text/plain");
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
};
