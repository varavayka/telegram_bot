
import { Configuration,OpenAIApi } from "openai";
const config = new Configuration({
    organization: 'org-tj0xVqxVJLL830U9WTKTzqeT',
    apiKey: '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'
})


export default async function openIaComletionWord(query=null, choiceModel= 'text-davinci-003',temperature = 0.9){
   
    try{
        const openai = new OpenAIApi(config)
        const complete = await openai.createCompletion({
            model:choiceModel,
            prompt: query,
            temperature:temperature,
            max_tokens: 500,
        })
        return complete.data.choices[0].text
    }catch(err){
        switch(await err.response.error_code){
            case 429:
                return `Произошла ошибка на сервере, код ошибки -> ${err.response.error_code}, перезапустите бот.`
            
        }
    }
}
