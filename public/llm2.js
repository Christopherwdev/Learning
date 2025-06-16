const API_URL_BASE = "https://api.istero.com/resource/ai/tongyi/conversation";
const API_TOKEN = "20685a3246285365ad9a2cbcfa8917f1"; // Replace with your actual token

/**
 * Formats the input JSON data into the required message structure.
 * @param {Array} questions - Array of questions with user and model answers.
 * @returns {string} - The formatted message string.
 */
function formatInput(questions) {
    const formattedQuestions = questions.map(question => ({
        question: question.question,
        user_answer: question.user_answer,
        model_answer: question.model_answer,
    }));

    return `You are an automated answer grader. You will receive a list of questions, each with a user's answer and a model answer. For each question, compare the user's answer to the model answer point by point. Output a list of binary arrays, where each array corresponds to a question and indicates which points in the model answer were correctly addressed (1 for correct, 0 for incorrect). Separate each array with a coma, wrap all the arrays with a []. 

Questions: 

${JSON.stringify(formattedQuestions, null, 2)}

Only output the arrays, don't add anything else like explanation, or anyt words other than the arrays! The entire response has to be the arrays only. Example format: [[1,1,0],[0,1,0],[1,1,1]]`;
}

/**
 * Sends the formatted message to the API and handles the response.
 * @param {Array} input - JSON input data with questions, user answers, and model answers.
 */
async function processGrading(input) {
    // Format the JSON input into the required message
    const message = formatInput(input);

    // Prevent empty message submission
    if (message.trim() === '') {
        console.error("Message cannot be empty.");
        return null; // Return null to indicate an error
    }

    try {
        // Send the message to the API
        const response = await fetch(`${API_URL_BASE}?token=${API_TOKEN}&text=${encodeURIComponent(message)}`);

        if (!response.ok) {
            console.error(`Error: ${response.status}`);
            return null; // Return null to indicate an error
        }

        const data = await response.json();

        // Validate the response and return the grading result
        if (data.code === 200) {
            // Parse the API response (expected to be a binary array in string format)
            const gradingResult = JSON.parse(data.data.answer);
            return gradingResult; // Return the grading result
        } else {
            console.error(`API Error: ${data.message || 'Unknown error'}`);
            return null; // Return null to indicate an error
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return null; // Return null to indicate an error
    }
}


// const exampleInput = [
//     {
//         question: "What is the capital of France?",
//         user_answer: "Paris",
//         model_answer: ["Paris"],
//     },
//     {
//         question: "Name two primary colors.",
//         user_answer: "Red and Blue",
//         model_answer: ["Red", "Blue"],
//     },
// ];

// processGrading(exampleInput);