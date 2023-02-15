import axios from 'axios'
import randomLogin from '../tgModule/random_login_module.mjs'
import {writeDataBase,findDocument} from '../../dataBase.mjs'
// const randomAdress = randomLogin()


async function createTempEmail(address,password) {
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
                if(err.response.status === 400)
                throw new Error(`Данные для авторизации заполнены некорректно или не полностью`)
                if(err.response.status === 401)
                throw new Error(`Данные для авторизации заполнены некорректно`)
                if(err.response.status === 422)
                throw new Error(`Имя пользователя адреса при создании учетной записи недостаточно длинное или домен учетной записи неверен`)
                if(err.response.status === 429)
                throw new Error(`Слишком много запросов на регистрацию, максимально допустимое количество 8 запросов в секунду.`)
        }
}


async function getMessageTempEmail(address){
    
    const linkApi = 'https://api.mail.tm'
        const token = await findDocument(address)
        const message = await axios.get(`${linkApi}/messages?page=1`,{
            headers:{
            'accept':'application/json',
            'Authorization':`Bearer ${token}`
            }
        })
        if(message.status <= 204 && message.status >= 200){
            const {from,subject,intro,createdAt} = message.data[0]
            console.log(message.data)
            return `От кого: ${from.address}\nИмя: ${from.name}\nТема письма: ${subject}\nСодержание: ${intro}\nДата: ${createdAt}
            `
        }else{
            throw new Error(`Произошла ошибка сервера, попробуйте позже, статус-код ответа - ${message.status}`)
        }
}

export{createTempEmail,getMessageTempEmail}
