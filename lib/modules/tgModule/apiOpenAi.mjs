
import { Configuration,OpenAIApi } from "openai";
const config = new Configuration({
    organization: process.env.API_ORGANIZATION_OPENAI,
    apiKey: process.env.API_TOKEN_OPENAI
})


export default async function openIaComletionWord(query=null, choiceModel= 'text-davinci-003',temperature = 0.9){
    try{
        const openai = new OpenAIApi(config)
        const complete = await openai.createCompletion({
            model: choiceModel,
            prompt: query,
            temperature:temperature,
            max_tokens: 500,
        })
        const completeWord = complete.data.choices[0].text
       return completeWord
    }catch(err){
        if(err.response.status === 401 || err.response.status === 403){
            throw new Error('Ошибка, не авторизован')
        }
            throw new Error('Ошибка в модуле apiOpenAI')
    }
}
