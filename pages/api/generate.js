import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPerfix = `Write me a fable story with the topic below.

Topic:`;
const generateAction = async (req, res) => {

    //Run first prompt
    console.log(`API: ${basePromptPerfix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${basePromptPerfix}${req.body.userInput}\n`,
        temperature: 0.7,
        max_tokens: 1000,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    //Build Prompt #2 here.
    const secondPrompt = `
    Take the story and topic of the poem below and generate a new poem with deep meaning and philosophical.
    
    Topic: ${req.body.userInput}

    Story: ${basePromptOutput.text}

    Poem:
    `

    //I call the OpenAI API a second time with Prompt #2.
    const  secondPromptCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${secondPrompt}`,
        //I set a higher temperature for this one. Up to you!
        temperature: 0.75,
        max_tokens: 256,
    });

    //Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;