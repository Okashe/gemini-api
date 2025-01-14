import dotenv, { parse } from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import readline from 'readline'

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;



const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());



app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    try {
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: 'Error generating content' });
    }
});
app.post('/flash', async (req, res)=>{
    const {prompt} = req.body;
    try{
        const result = await model.generateContent(`create questions and brief answers as array for flash card purpose based on the query ${prompt}. connect each question with its answer and create space between each set of question and answer. Give a json format of question and answer pair.Start with [ and finish with ]`);
        
        
       const text = result.response.candidates[0].content.parts[0].text;
      
       console.log('generated text:', text)
     // Extract JSON array from the text
     const jsonArrayMatch = text.match(/\[.*\]/s);
     if (!jsonArrayMatch) {
         throw new Error('No JSON array found in the generated text');
     }
     const jsonArrayString = jsonArrayMatch[0];
     const flashcardsArray = JSON.parse(jsonArrayString);
     console.log('Parsed flashcards:', flashcardsArray);

     res.status(200).json({ response: flashcardsArray });
    }catch(error){
        res.status(500).json({error: 'Error generating flashcard'});
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




