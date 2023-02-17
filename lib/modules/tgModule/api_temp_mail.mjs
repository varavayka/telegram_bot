import axios from 'axios'
import {writeDataBase,findDocument} from '../../dataBase.mjs'

async function createTempEmail(address,password) {
    if(address.length <= 5 && password.length <= 5){
       throw new Error('Некорректная длинна!')
    }
    try{
        const linkApi = 'https://api.mail.tm'
        const domain = await axios.get(`${linkApi}/domains`)
        const createEmail = await axios.post(`${linkApi}/accounts`,
        {address:`${address.trim()}@${domain.data['hydra:member'][0].domain}`,password:password.trim()})

        if(createEmail.status >= 200 && createEmail.status <= 204){

            const getToken = await axios.post(`${linkApi}/token`,
            {address:createEmail.data.address,password})
            
            const resultRequest = {
                address:createEmail.data.address,
                password,
                token: getToken.data.token,
                idToken:getToken.data.id,
                dateCreated: createEmail.data.createdAt
            }
            const responseCompleteCreated = {
                address:createEmail.data.address,
                password,
                dateCreated: createEmail.data.createdAt,
                pointCheckedResult: true
            }
            await writeDataBase(resultRequest)
            return responseCompleteCreated
        }
    }catch(err){
       throw new Error('ошибка в функции создания почтового ящика, модуль  - api_temp_mail')
    }
}


async function getMessageTempEmail(address){
    try{
        const linkApi = 'https://api.mail.tm'
        const token = await findDocument(address)
        const message = await axios.get(`${linkApi}/messages?page=1`,{
            headers:{
            'accept':'application/json',
            'Authorization':`Bearer ${token}`
            }
        })
        
        if(message.data.length == 0){
            return 'Сообщений нет'
        }else{
            const {from,subject,intro,createdAt} = message.data[0]
            return `От кого: ${from.address}\nИмя: ${from.name}\nТема письма: ${subject}\nСодержание: ${intro}\nДата: ${createdAt}
            `
        }
        
    }catch(err){
        console.log(err)
        return new Error('Ошибка в функции получения сообщенийб модуль - api_temp_mail')
    }
    
}

export{createTempEmail,getMessageTempEmail}
