import {setExecuteResultUI, createContractInstance} from "./utils.js";
import {accounts} from "./accounts";

const carpooling_truffleFile = require('../../../build/contracts/Carpooling.json');
export var carpooling_abiDefinition = carpooling_truffleFile['abi'];
export var carpooling_bytecode = carpooling_truffleFile['bytecode'];

var address;
var CarpoolingInstance;


// get the owner of the carpooling instance
window.doCarpoolingGetOwner = function() {
    try {
        CarpoolingInstance.methods.owner().call().then(function(result){
            setExecuteResultUI('Call','owner','', result,'',false);
        })
    }
    catch(error) {
        console.log(error);
        setExecuteResultUI('Call','owner','', "Error, check your contract address. "+error,'',true);
    }
}

// get the number of available slots of the carpooling instance
window.doCarpoolingGetNAvailableSlot = function() {
    try {
        CarpoolingInstance.methods.nAvailableSlot().call().then(function(result){
            setExecuteResultUI('Call','nAvailableSlot','', result,'',false);
        })
    }
    catch(error) {
        console.log(error);
        setExecuteResultUI('Call','nAvailableSlot','', "Error, check your contract address. "+error,'',true);
    }
}




// Use the address to retrieve the existing instance of a factoryCarpooling
window.doCarpoolingSelection = function()  {
    address = document.getElementById('carpooling_address').value;
    CarpoolingInstance = createContractInstance(address, carpooling_abiDefinition, "carpooling");   
}

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