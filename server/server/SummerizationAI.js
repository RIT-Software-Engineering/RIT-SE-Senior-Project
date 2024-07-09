const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyA7EQoOnZXOl2fHbRy4UVOhAUoIxj1c204");

const PROMPT_GENERATE_FEEDBACK_SUMMARY_0 = `You are an writing assistant that is providing a student their project performance based upon their peer's feedback
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
`

const PROMPT_GENERATE_FEEDBACK_SUMMARY_INLINE = `You are a writing assistant providing a student their project performance based upon their peer's feedback. Summarize and anonymize the following peer review feedback from a student project. 
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

const model = genAI.getGenerativeModel({
        model: "gemini-1.5-latest",
        systemInstruction: PROMPT_GENERATE_FEEDBACK_SUMMARY_0
    });

const inlineModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: PROMPT_GENERATE_FEEDBACK_SUMMARY_INLINE
});


async function provide_summary(studentFeedback) {
    try {
        const context = `${studentFeedback}`
        const result = await model.generateContent(context);
        return result.response.text()
    } catch (error) {
        console.error("Error generating content:", error)
    }
}

async function complete_next_sentence(studentFeedback, currentText) {
    try {
        const context = `Student Feedback:\n${studentFeedback}\n\nCurrent Coach Feedback:\n${currentText}`
        const result = await inlineModel.generateContent(context);
        return result.response.text()
    } catch (error) {
        console.error("Error generating content:", error)
    }
}

module.exports = {
    provide_summary,
    complete_next_sentence
}

// const context = {
//     Student: "Student context is for",
//     Ratings: {
//         From: "Student Feedback is From",
//         Feedback: {
//             "Category": "Feedback entered in fourm"
//         }
//     }
// }

const test_john_smith = `{"Student":"John Smith","Ratings":[{"From":"Dude Bro","Feedback":{"Cooperation And Attitude":"John SmiCooperation and Attitudeth","Quantity Of Work":"Quantity1","Initiative":"Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity Quantity"}},{"From":"Jack James","Feedback":{"Cooperation And Attitude":"Cooperation and AttitudeCooperation and AttitudeCooperation and AttitudeCooperation and AttitudeCooperation and AttitudeCooperation and AttitudeCooperation and Attitude","Quantity Of Work":"Lots of work done","Initiative":"I hate u"}}]}`
const test_dude_bro = `{"Student":"Dude Bro","Ratings":[{"From":"John Smith","Feedback":{"Cooperation And Attitude":"Dude bro sucks","Quantity Of Work":"Dude bro sucks again","Initiative":"Dude bro sucks initiative"}},{"From":"Jack James","Feedback":{"Cooperation And Attitude":"NOT COOPORATIVE","Quantity Of Work":"None","Initiative":"Ily"}}]}`
const test_jack_james = `{"Student":"Jack James","Ratings":[{"From":"John Smith","Feedback":{"Cooperation And Attitude":"jack james coop","Quantity Of Work":"jack james quantity","Initiative":"jack james initiative"}},{"From":"Dude Bro","Feedback":{"Cooperation And Attitude":"Cooperation and Attitudejackjames","Quantity Of Work":"Quantity2","Initiative":"asdasd"}}]}`

const test_completion_1 = "Your team members appreciate your hard work and the quantity of contributions you made to the project.  However, there were some concerns raised about your overall at"
const test_completion_2 = "Your team members appreciate your hard work and the quantity of contributions you made to the project.  However, there were some concerns raised about your overall attitude and cooperation.   The feeedback suggests you could have been more proactive in working collaboratively with the team and being m"
const test_completion_3 = ""

const testFeedback = (context, name) => {
    provide_summary(context).then((response) => {
        console.warn('Test for', name)
        console.log(response)
    })
}

const testCompletion = (context, old_feedback, name) => {
    complete_next_sentence(context, old_feedback).then((response) => {
        console.warn('Test for', name)
        console.warn('Current text:', old_feedback)
        const finalResponse = response.trim().replace(old_feedback, "")
        console.log(finalResponse)
    })
}

// testFeedback(test_john_smith, "John Smith")
// testFeedback(test_dude_bro, "Dude Bro")
// testFeedback(test_jack_james, "Jack James")

// testCompletion(test_john_smith, test_completion_1, "John Smith")
// testCompletion(test_john_smith, test_completion_2, "John Smith")
// testCompletion(test_john_smith, test_completion_3, "John Smith")

module.exports = {
    provide_summary,
    complete_next_sentence
}