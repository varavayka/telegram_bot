import { Markup, Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
dotenv.config()
import {queryAboutIp, validIp} from '../lib/modules/tgModule/api_shodan.mjs'
import queryOpenAI from '../lib/modules/tgModule/apiOpenAi.mjs'
import keyboard from '../lib/modules/tgModule/keyboard.mjs'
import {createTempEmail,getMessageTempEmail} from '../lib/modules/tgModule/api_temp_mail.mjs'
const bot = new Telegraf(process.env.API_TOKEN_TG)
const BotCommand = [{ command: '/menu', description: 'Меню' }]

bot.start(async ctx => {
    try{
        await ctx.reply(`Привет ${ctx.from.username}`)
        await ctx.telegram.setMyCommands(BotCommand)
    }catch(err){
        console.log(err)
    }
    
})
bot.hears('/menu', async ctx => {
    try{
        await ctx.replyWithHTML('<code>Справка:\n<b>OpenAI</b>-> Запрос к нейросети\n<b>Temp Mail</b>-> Временная почта\n<b>Report By IP-> Отчет по IP</b></code>', Markup.keyboard(keyboard('OpenAI', 'Temp Mail', 'Report By IP')))
    }catch(err){
        console.log(err)
    }
    
})

bot.hears('OpenAI',async ctx => {
    try{
        await ctx.replyWithHTML('<code>Задай любой интерсующий вопрос</code>')
        bot.on('message', async ctx => {
            
            try{
                ctx.reply(await queryOpenAI(ctx.message.text))
            }catch(err){
                ctx.reply('Ошибка на сервере, отправьте новый запрос')
            }
        })
      }catch(err){
          ctx.reply('При выполнении вашего запроса произошел сбой, попробуйте повторить попытку.')
      }
    
    
})


bot.hears('Report By IP',async ctx => {
    try{
        await ctx.replyWithHTML('<code>Отправьте корректный IP и ожидайте отчет!</code>')
    }finally{
        bot.on('message', async ctx => {
            if(validIp(ctx.message.text)){
             ctx.reply('Ожидайте отчет!')
             ctx.reply(await queryAboutIp(ctx.message.text))
            }else {
             ctx.reply('Вы отправили некорректный IP')
             return
            }
        })
    } 
})

bot.hears('Temp Mail',async ctx => {
    try{
        await ctx.replyWithHTML('<code>Данный модуль позволяет создавать временные почтовые ящики для регистрации на не проверенных сервисах</code>',{...Markup.inlineKeyboard(
            [
                Markup.button.callback('Получить сообщения','getMessages'),
                Markup.button.callback('Создать аккаунт','createAccount')
            ]
        )})
    }catch(err){
        throw new Error('Ошибка, обработчик событий - Temp Mail')
    }
})


bot.action('createAccount', async (ctx,next)  => {
    try{
        await ctx.replyWithHTML('Справка: <code>Придумайте Email-адрес, отправьте его без имени домена и спец символа  - @ и пароль, формат записи - emailaddress,password</code>')
    }catch(err){
        return new Error('ошибка в скрипте main, обработчик  - createAccount')
    }finally{
        bot.on('message', async ctx => {
            try{
                const createdUserCredentils = ctx.message.text.split(',')
                const {address,password,dateCreated} = await createTempEmail(createdUserCredentils[0],createdUserCredentils[1])

                if(createdUserCredentils[0].length <= 5 && createdUserCredentils[1].length <= 5){
                    new Error('Длинна не соответсвует минимальной - "минимальная длина 6 символов"')
                }else{
                    await ctx.replyWithHTML( `<code>Ваша почта: ${address}\nВаш пароль: ${password}\nДата создания: ${dateCreated}\nСсылка на сервис: https://mail.tm/\nСправка: Получать сообщения можно прямо в боте.</code>`)
                }

            }catch(err){
                ctx.reply("Некорректный запрос, формат записи - address,password без спец символов в адресе и пробелово перед и после запятой, минимальная длинна  - 6 символов!")
            }
            
        })
    }
})
bot.action('getMessages', async (ctx,next)  => {
    try{
        await ctx.replyWithHTML('Справка: <code>Для Проверки сообщений необходимо отправить email адрес который вы получили ранее.</code>')
    }catch(err){
        return new Error('ошибка в обработчике события  - getMessage')
    }finally{
        bot.on('message', async ctx => {
            if(ctx.message.text.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi) != null){
                try{
                    await ctx.reply(await getMessageTempEmail(ctx.message.text))  
                }catch(err){
                    await ctx.reply('Произошла ошибка на сервере, попробуйте позже')  
                }
            }else{
                await ctx.reply('Вы ввели некорректный адрес электронной почты или же запрос не содержит адрес электронной почты.')
            }
        }) 
    }
})
bot.launch()





