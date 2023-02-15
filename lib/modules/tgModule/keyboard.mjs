
export default function keyboard(...buttons){
    const buttonArray = []
    buttons.forEach(btn => buttonArray.push(btn.split(',')))
    return buttonArray
}

