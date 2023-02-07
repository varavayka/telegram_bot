import { Markup, Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
dotenv.config()
import colorText from 'chalk'
import setWelcomeMsg from '../lib/modules/tgModule/setWelcomeMessage.mjs'
import {queryAboutIp, validIp} from '../lib/modules/tgModule/api_shodan.mjs'
const bot = new Telegraf(process.env.API_TOKEN_TG)
const BotCommand = [
    { command: '/help', description: 'Справка' },
    { command: '/menu', description: 'Меню опций' },
    { command: '/hide_keyboard', description: 'Скрыть клавиатуру' },
    { command: '/help', description: 'Справка' },
    { command: '/help', description: 'Справка' }
]

bot.start(async (ctx) => {
    const { id, first_name, username } = ctx.message.from
    ctx.reply(setWelcomeMsg(username).toUpperCase())
    await ctx.telegram.setMyCommands(BotCommand)
    ctx.reply('\nСправка - /help  \nМеню опций - /menu')
})

bot.hears('/help', ctx => {
    const nickName = ctx.message.from
    ctx.reply(`${nickName.username} -> \nВведите/нажмите  - /menu  и выберите соответсвующий пункт меню`)
})

bot.hears('/menu', ctx => {
    ctx.reply('Меню Опций',
        Markup.keyboard(
            [
                ["🔍 Search "],
                ["☸ Options"],
                ['Hide']
            ]
        ))
})


bot.on('message', (ctx) => {
    const messageMenu = ctx.message.text
    if(messageMenu === 'Hide') {
        ctx.reply('hide keyboard',Markup.removeKeyboard())
    }
    if(messageMenu.slice(3, messageMenu.length) === 'Search'){
		return ctx.reply(
           'Выберите сервис',
            {
            ...Markup.inlineKeyboard(
                [
                    Markup.button.callback("Shodan", "useShodan"),
                    Markup.button.callback("Api Open IA", "openIa"),
                ]),
            },
        )
    }
    if(validIp(messageMenu)){
        bot.action('useShodan', async (ctx) => {
            const responseUser = await queryAboutIp(messageMenu,process.env.API_TOKEN_SHODAN)
           
           ctx.reply(`
            \nОткрытые порты: ${responseUser.generalInformation.openPort},\n
            \nКод Страны: ${responseUser.generalInformation.countryCode},\n
            \nГород: ${responseUser.generalInformation.city},\n
            \nИмя хоста: ${responseUser.generalInformation.hostname},\n
            \nПровайдер: ${responseUser.generalInformation.provider},\n
            \nДомены расположенные на IP: ${responseUser.generalInformation.domains},\n
            \nПолная информация по данному IP адресу:\n
                
            \nСсылка: ${responseUser.fullInformation.url}\n
           `)
        })
    }else{
        ctx.reply('Не правильный IP')
    }
    
})


bot.action('openIa', ctx => {
    console.log('openIa')
})


bot.launch()



