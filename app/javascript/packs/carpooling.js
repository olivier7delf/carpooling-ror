import {setExecuteResultUI} from "./utils.js";
import {accounts} from "./accounts";


function getCarpoolingAddressUsingIndex(instance, index){
    instance.methods.getCarpoolingAddressUsingIndex(index).call()
        .then(result => setExecuteResultUI('Call','getCarpoolingAddressUsingIndex','', result,'',false))
        .catch(error => {
            setExecuteResultUI('Call','getCarpoolingAddressUsingIndex','', "Error: out of range ?!",'',true);
            console.log(error.message)});
}

async function createCarpooling(instance){
    //"nantes","bordeaux",3,2000000000,1636830368,0xC39F595D9ad5b208988674B7c502e0f5c69a32Ab,0
    console.log("{from:accounts[0]}:", accounts[0]);
    try {
        await instance.methods.createCarpooling(
            "nantes","bordeaux",3,20,1636830368,accounts[0],0
            ).send({
                from:accounts[0],
                gas: '6612380',
                gasPrice: '30000000'})
            .then(function(result){setExecuteResultUI('Send','createCarpooling','', result,'',false)
        })
    }
    catch(error) {
        console.log(error);
        setExecuteResultUI('Call','createCarpooling','', "Error: Carpooling not created ! Check your input",'',true);
    }
}




export {getCarpoolingAddressUsingIndex, createCarpooling}