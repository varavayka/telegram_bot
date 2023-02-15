

export default function randomLogin(){
    const randomLoginArrayElement = [
      'a','b','c','d','e','f','w','r','t','h','j','k','l','n','o','p','l','1','2','3','4','5','6','7','8','9','0',
       'Z','X','C','A','Q','W','S','E','D','R','F','T','G','Y','H','U','J','N','M','B','V','K','J','U','I','L','O','M'
    ]
    
    const finishRandomLogin = []
    
    randomLoginArrayElement.forEach((el,indx) => {
        const randomIndex = Math.floor(Math.random() * (randomLoginArrayElement.length / indx))
        if( el[randomIndex]!= undefined && el[randomIndex] != Infinity){
          finishRandomLogin.push(el[randomIndex])
        }
    })
    return finishRandomLogin.join('')
    
}

