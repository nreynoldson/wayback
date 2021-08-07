
export function randomDate(){
    var month = randomInRange(1, 12);
    var max;
    console.log(month);

    switch(month){
        case 2:
            max = 28;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            max = 30;
            break;
        default:
            max = 31;
    }

    var day = randomInRange(1, max);
    console.log(day);
    return [month, day];
}

function randomInRange(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}