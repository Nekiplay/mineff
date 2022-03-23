const mp  = {
    x: 100,
    y: 100,
    z: 100
}
let i = 0;
for(let x = mp.x-10; x<=mp.x+10; x++){
    for(let y = mp.y-10; y<=mp.y+10; y++){
        for(let z = mp.z-10; z<=mp.z+10; z++){
            i++;
            setTimeout(() => {
                console.log("----------------------------")
                console.log(x-mp.x+10);
                console.log(y-mp.y+10);
                console.log(z-mp.z+10);
            }, 10*i);
        }
    }
}