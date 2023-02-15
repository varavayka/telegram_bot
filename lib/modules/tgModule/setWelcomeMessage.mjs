

function welcomeMessage(username) {
    const arraySpecialUserName = ['capbonzo', 'kkkkk23kkkkk','iiiiiiiyyyyyyyy','il_Boyko','galanova_n']
    let customMessage
        arraySpecialUserName.forEach(account => {
            if(username == account)
            switch(account){
                case 'capbonzo':
                    customMessage = `${username} -> Хуесос империалист`
                    break
                case 'il_Boyko':
                    customMessage = `${username} -> Либиральный надристышь`
                    break
                case 'kkkkk23kkkkk':
                    customMessage = `${username} -> Либиральный напёрдышь`
                    break
                case 'iiiiiiiyyyyyyyy':
                    customMessage = `${username} -> Последователь высшей социалистческой идеи, остальных ебал в рот`
                    break
                case 'galanova_n':
                    customMessage = `${username} -> Вонючка блять, косарь скидуй тётя,пока я тебя не отпиздошил`
            }
            
        })
    const checkUser = arraySpecialUserName.includes(username)
        if(checkUser){
          return customMessage  
        }
        return `Добро пожаловать ${username}`
}


export default welcomeMessage