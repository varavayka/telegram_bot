import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()

async function queryAboutIp(ip= '0.0.0.0', token = process.env.API_TOKEN_SHODAN){
    
    if(validIp(ip)){
        
        try{
            const getDataIp = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${token}`)
            const reportResponse = JSON.parse(JSON.stringify(getDataIp.data))
            const {city, isp, ports, hostname, country_code,domains} = reportResponse
            const responseUserObject = {
                generalInformation: {
                    openPort: ports,
                    countryCode: country_code,
                    city,
                    hostname,
                    provider: isp,
                    domains
                },
                fullInformation: {
                    title: 'full info',
                    url: `https://www.shodan.io/host/${ip}`
                }
               
            }
            return `Открытый Порт: ${responseUserObject.generalInformation.openPort}\nКод Страны: ${responseUserObject.generalInformation.countryCode}\nГород: ${responseUserObject.generalInformation.city}\nИмя Хоста: ${responseUserObject.generalInformation.hostname}\nПровайдер: ${responseUserObject.generalInformation.provider}\nДомены: ${responseUserObject.generalInformation.domains}\nПодробный отчет:\nСсылка: ${responseUserObject.fullInformation.url}
            `
        }catch(err){
            switch(err.response.status){
                case 404: 
                 return 'Не найдена информация, IP адрес не должен быть локальным.'
                case 403: 
                 return 'Токен не правильный'
            }
        }
    }else{
        return 'Некорректный IP адрес'
    }
    
}

function validIp(ip){
    const regExpIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/gi
    if(ip.match(regExpIp) != null){ 
        return true
    }else{
        return false
    }
}
export {validIp,queryAboutIp}