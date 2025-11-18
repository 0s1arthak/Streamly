export const generateSixDigitsOtp=()=>{
    const arr=[0,1,2,3,4,5,6,7,8,9]
    let value="";
    for(let i=1;i<=6;i++){
        let index=Math.floor(Math.random()*9)
        value+=arr[index].toString();
    }
    console.log(value)
    return value
}