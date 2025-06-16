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

let currentChatId = null;

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
        return null;
    }

    try {
        // Start a new chat session if we don't have one
        if (!currentChatId) {
            const newChatResponse = await fetch('https://server-ef04.onrender.com/api/chat/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const newChatData = await newChatResponse.json();
            
            if (!newChatData.success) {
                throw new Error(newChatData.error || 'Failed to start chat session');
            }
            currentChatId = newChatData.chatId;
        }

        // Send the grading message
        const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: currentChatId,
                message: message
            })
        });

        const data = await response.json();
        
            // Parse the response to extract the grading arrays
            // The API might return the response in data.response
            const responseText = data.response;
            // console.log(data.response);
            
            // Try to find the grading arrays in the response
// console.log(responseText);
            return responseText;
            
            // const arrayMatch = responseText.match(/\[(\[[\d,\s]*\])/);
            // if (arrayMatch && arrayMatch[1]) {
            //     const gradingResult = JSON.parse(arrayMatch[1]);
            //     return gradingResult;
            // } else {
            //     // If no array found, try to parse the whole response as JSON
            //     try {
            //         const gradingResult = JSON.parse(responseText);
            //         return gradingResult;
            //     } catch (e) {
            //         console.error("Could not parse grading result from response:", responseText);
            //         return null;
            //     }
            // }
        
    } 
    catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

// Example usage remains the same:
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
// processGrading(exampleInput).then(result => console.log(result));