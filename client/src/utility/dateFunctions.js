
export function randomDate(){
    var month = randomInRange(1, 12);
    var max;
    console.log(month);

    max = getMaxDay(month);

    var day = randomInRange(1, max);
    console.log(day);
    return [month, day];
}

function randomInRange(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

export function getNextDay(month, day){
    var maxDay = getMaxDay(month);
    if(day == maxDay)
    {
        day = 1;
        if(month == 12)
            month = 1;
        else
            month = parseInt(month) + 1;
    }
    else
        day = parseInt(day) + 1;
    
    console.log(month, day)
    return [month, day];
}

export function getPrevDay(month, day){
    if(day == 1){
        if(month == 1)
            month = 12;
        else
            month = parseInt(month) - 1;
        
        day = getMaxDay(month);
    }
    else
        day = parseInt(day) - 1;
    
    return [month, day];
}

function getMaxDay(m){
    switch(m){
        case 2:
            return 21;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        default:
            return 31;
    }
}