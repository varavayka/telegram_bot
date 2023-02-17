import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()
import {MailModel} from '../lib/Schema/user.mjs'
async function writeDataBase(accountObject){
    try{
        mongoose.set('strictQuery', false) 
        await mongoose.connect(process.env.MONGOSERVER)
        
        const account = new MailModel(
        {
            address: accountObject.address,
            password:accountObject.password,
            date: accountObject.dateCreated,
            token: accountObject.token
        })
        await account.save()
        console.log('Документ записан!')
    }catch(err){
        return console.log('ошибка' + err)
    }finally{
        await mongoose.disconnect()
        console.log("соединение разорвано")
    }
}

async function findDocument(address){
    mongoose.set('strictQuery', false)
    try{
    await mongoose.connect(process.env.MONGOSERVER)
    const document = await MailModel.find({address})
     return document[0].token
    }catch(err){
        return err
    }finally{
        await mongoose.disconnect()
    }
    
}
export {writeDataBase,findDocument}




// document.forEach(document => document.address.match(/\w+/gi)[0] === address)