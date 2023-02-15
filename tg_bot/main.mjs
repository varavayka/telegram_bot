import { Markup, Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
dotenv.config()
import colorText from 'chalk'

import setWelcomeMsg from '../lib/modules/tgModule/setWelcomeMessage.mjs'
import {queryAboutIp, validIp} from '../lib/modules/tgModule/api_shodan.mjs'
import queryOpenAI from '../lib/modules/tgModule/apiOpenAi.mjs'
import keyboard from '../lib/modules/tgModule/keyboard.mjs'
import {createTempEmail,getMessageTempEmail} from '../lib/modules/tgModule/api_temp_mail.mjs'
const bot = new Telegraf(process.env.API_TOKEN_TG)
const BotCommand = [{ command: '/menu', description: 'Меню' }]

bot.start(async (ctx) => {
    const { id, first_name, username } = ctx.message.from
    ctx.reply(setWelcomeMsg(username).toUpperCase())
    ctx.telegram.setMyCommands(BotCommand)
})
bot.hears('/menu', async ctx => {
    await ctx.reply('Меню', Markup.keyboard(keyboard('OpenAI', 'Temp Mail', 'Report By IP')))
    await ctx.replyWithHTML('<code><b>Справка</b>:\n<b>OpenAI</b>-> Запрос к нейросети\n<b>Temp Mail</b>-> Временная почта\n<b>Report By IP-> Отчет по IP</b></code>')
})

bot.hears('OpenAI',async ctx => {
    await ctx.replyWithHTML('<code>Задай любой интерсующий вопрос</code>')
    bot.on('message', async ctx => {
        try{
            if(ctx.message.from.username === 'iiiiiiiyyyyyyyy'){
                ctx.replyWithHTML('<code>Исполняю, жи есъ</code>')
            }else{
                ctx.replyWithHTML('<code>выполнение запроса⏳</code>')
            }
        }catch(err){
            switch(await err.response.error_code){
                case 400:
                    ctx.reply(`Произошла ошибка на сервере, код ошибки -> ${err.response.error_code}, перезапустите бот.`)
                    break
                case 429:
                    ctx.reply(`Произошла ошибка на сервере, код ошибки -> ${err.response.error_code}, перезапустите бот.`)
                    break
            }
        }finally{
            ctx.reply(await queryOpenAI(ctx.message.text))
        }

    })
    
})


bot.hears('Report By IP',async ctx => {
    await ctx.replyWithHTML('<code>Отправьте корректный IP и ожидайте отчет!</code>')
    bot.on('message', async ctx => {
       if(validIp(ctx.message.text)){
        ctx.reply(await queryAboutIp(ctx.message.text))
       }
    })
    
})

bot.hears('Temp Mail',async ctx => {
    await ctx.replyWithHTML('<code>Данный модуль позволяет создавать временные почтовые ящики для регистрации на не проверенных сервисах</code>',{...Markup.inlineKeyboard(
        [
            Markup.button.callback('Получить сообщения','getMessages'),
            Markup.button.callback('Создать аккаунт','createAccount')
        ]
    )})
   
})
bot.action('getMessages', async ctx  => {
    await ctx.replyWithHTML('Справка: <code>Для Проверки сообщений необходимо отправить email адрес который вы получили ранее.</code>')
    bot.on('message', async ctx => {
        if(ctx.message.text.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi) != null){
            await ctx.reply(await getMessageTempEmail(ctx.message.text))
        }
    })
})

bot.action('createAccount', async ctx  => {
    await ctx.replyWithHTML('Справка:    <code>Придумайте Email-адрес, отправьте его без имени домена и спец символа  - @ и пароль, формат записи - emailaddress,password</code>')
    bot.on('message', async ctx => {
        const createdUserCredentils = ctx.message.text.split(',')
        const {address,password,dateCreated,pointCheckedResult} = await createTempEmail(createdUserCredentils[0],createdUserCredentils[1])
    
        await ctx.replyWithHTML( `<code>Ваша почта: ${address}\nВаш пароль: ${password}\nДата создания: ${dateCreated}\nСсылка на сервис: https://mail.tm/\nСправка: Получать сообщения можно прямо в боте.</code>`)
    })
})






bot.launch()
.then((status) => {console.log('Сервер работает')})
.catch(err => console.log(err))




