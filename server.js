import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import readline from 'readline'

dotenv.config();




const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ask me anything: ', async (prompt) => {
    if (prompt !== null) {
        try {
            const result = await model.generateContent(prompt);
           
          
            if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
                console.log(result.response.candidates[0].content.parts[0].text)
            } else {
                console.error('Unexpected response structure:', result);
            }
          
        } catch (error) {
            console.error('Error generating content:', error);
        }
    } else {
        console.log('User cancelled the prompt');
    }
    rl.close();
});


