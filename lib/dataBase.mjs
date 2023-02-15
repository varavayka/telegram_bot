import mongoose from 'mongoose'
const Schema = mongoose.Schema
        const id = Schema.ObjectId
        const mailSchema = new Schema({
            address: String,
            password: String,
            date: Date,
            token: String
        })
        const MailModel = mongoose.model('MailModel', mailSchema)
async function writeDataBase(accountObject){
    try{
        mongoose.set('strictQuery', false) 
        await mongoose.connect('mongodb://127.0.0.1:27017/temp_mail_account')
        
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
    await mongoose.connect('mongodb://127.0.0.1:27017/temp_mail_account')
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