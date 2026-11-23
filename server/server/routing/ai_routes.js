const UserAuth = require("./user_auth");
const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const AI_API_TYPE = (process.env.AI_API_TYPE || "gemini").trim().toLowerCase();
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "qwen3:latest";
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || "").trim();

function normalizeKey(value) {
  let key = (value || "").trim();
  if (
    key.length >= 2 &&
    ((key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'")))
  ) {
    key = key.slice(1, -1).trim();
  }
  return key;
}

const geminiKey = normalizeKey(process.env.GOOGLE_API_KEY);
const openaiKey = normalizeKey(process.env.OPENAI_API_KEY);

function isConfiguredKey(key) {
  return (
    key.length > 0 &&
    !["INSERT_KEY_HERE", "ADD_KEY_HERE", "KEYHERE"].includes(key.toUpperCase())
  );
}

function isProviderConfigured() {
  if (AI_API_TYPE === "gemini") {
    return isConfiguredKey(geminiKey) && Boolean(GEMINI_MODEL);
  }
  if (AI_API_TYPE === "openai") {
    return (
      isConfiguredKey(openaiKey) &&
      Boolean(OPENAI_MODEL) &&
      Boolean(OPENAI_BASE_URL)
    );
  }
  return false;
}

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function requireValue(value, field) {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && !value.trim())
  ) {
    throw httpError(`Missing '${field}' in request body.`, 400);
  }
  return value;
}

function contextToText(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

let geminiClient;
let openaiClient;

function getGeminiClient() {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(geminiKey);
  }
  return geminiClient;
}

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: openaiKey,
      baseURL: OPENAI_BASE_URL,
      timeout: 60_000,
      maxRetries: 1,
    });
  }
  return openaiClient;
}

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

async function generateAIText(content, systemInstruction) {
  if (!["gemini", "openai"].includes(AI_API_TYPE)) {
    throw httpError(`Unsupported AI_API_TYPE: ${AI_API_TYPE}`, 500);
  }
  if (!isProviderConfigured()) {
    throw httpError("The selected AI provider is not configured.", 503);
  }

  let text;
  if (AI_API_TYPE === "gemini") {
    const model = getGeminiClient().getGenerativeModel({
      model: GEMINI_MODEL,
      ...(systemInstruction ? { systemInstruction } : {}),
    });
    const result = await model.generateContent(content);
    text = result.response.text();
  } else {
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content });

    const response = await getOpenAIClient().chat.completions.create({
      model: OPENAI_MODEL,
      messages,
    });
    text = response.choices[0]?.message?.content;
  }

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("The AI provider returned an empty response.");
  }
  return text;
}

function provide_summary(studentFeedback) {
  return generateAIText(
    contextToText(studentFeedback),
    PROMPT_GENERATE_FEEDBACK_SUMMARY,
  );
}

function provide_historic_summary(studentFeedback) {
  return generateAIText(
    contextToText(studentFeedback),
    PROMPT_GENERATE_HISTORIC_SUMMARY,
  );
}

function generateResponse(prompt, context) {
  return generateAIText(
    `Prompt: ${prompt}\n\nContext: ${JSON.stringify(context)}`,
  );
}

function handleGenerationError(error, next) {
  if (error.statusCode === 400) {
    return next(error);
  }

  console.error("AI generation failed:", error);

  const message =
    error.statusCode === 503
      ? "The AI provider is not configured. Please contact an administrator."
      : "Failed to generate AI response.";
  return next(httpError(message, error.statusCode === 503 ? 503 : 502));
}

module.exports = () => {
  router.post(
    "/GenerateSummary",
    [UserAuth.isCoachOrAdmin],
    async (req, res, next) => {
      try {
        const context = requireValue(req.body?.context, "context");
        const response = await provide_summary(context);
        return res.type("text/plain").status(200).send(response);
      } catch (error) {
        return handleGenerationError(error, next);
      }
    },
  );

  router.post(
    "/GenerateHistoricSummary",
    [UserAuth.isCoachOrAdmin],
    async (req, res, next) => {
      try {
        const context = requireValue(req.body?.context, "context");
        const response = await provide_historic_summary(context);
        return res.type("text/plain").status(200).send(response);
      } catch (error) {
        return handleGenerationError(error, next);
      }
    },
  );

  router.post(
    "/GenerateResponse",
    [UserAuth.isCoachOrAdmin],
    async (req, res, next) => {
      try {
        const prompt = requireValue(req.body?.prompt, "prompt");
        const context = requireValue(req.body?.context, "context");
        const response = await generateResponse(prompt, context);
        return res.type("text/plain").status(200).send(response);
      } catch (error) {
        return handleGenerationError(error, next);
      }
    },
  );

  router.get(
    ["/CheckAIKeyExists", "/CheckGeminiKeyExists"],
    [UserAuth.isCoachOrAdmin],
    (req, res) => res.status(200).json({ valid: isProviderConfigured() }),
  );

  return router;
};
