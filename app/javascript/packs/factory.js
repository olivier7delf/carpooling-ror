
var FileSaver = require('file-saver');

const factory_truffleFile = require('../../../build/contracts/CarpoolingFactory.json');
export var factory_abiDefinition = factory_truffleFile['abi'];
export var factory_bytecode = factory_truffleFile['bytecode'];
var address;
var FactoryInstance;

import {addEventListItem, clearList, setPolygoncanLink, setExecuteResultUI, setData, createContractInstance} from "./utils.js";
import {getCarpoolingAddressUsingIndex, createCarpooling} from "./carpooling.js";

window.doDeployContract = async function()   {
    var gasAllowed = document.getElementById('deployment_estimatedgas').value;
    var acc = document.getElementById('coinbase').innerHTML;
    var myContract = await new web3.eth.Contract(factory_abiDefinition);
    var hash;
    myContract.deploy({data:factory_bytecode})
    .send({
        from: acc,
        gas: gasAllowed,//'14612388',
        gasPrice: '30000000'
    })
    .on('error', function(error){ console.log(error);         
        setExecuteResultUI('Call','admin','', error,'',true);
    })
    .on('transactionHash', function(transactionHash){ 
        hash = transactionHash;
    })
    .then(function(newContractInstance){
            setExecuteResultUI('Send','deploy','', newContractInstance,hash,false);
            console.log("newContractInstance.options=", newContractInstance.options);
            // console.log("newContractInstance.options.address=", newContractInstance.options.address);
            setData("invoke_contractaddress_deploy", newContractInstance.options.address, false)
            setPolygoncanLink('invoke_contracttransactionhash_link_deploy','address',newContractInstance.options.address);
            
            // On the client side, allow the user to download the address of its contract
            // Then, he can use it to retrieve his contract with the value he had set...
            var myFile = new Blob([newContractInstance.options.address], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(myFile, "ADDRESS_CONTRACTS.txt");
        });
}

// get the admin of the carpooling factory instance
function getAdmin(instance){
    try {
        instance.methods.admin().call().then(function(result){
            setExecuteResultUI('Call','admin','', result,'',false);
        })
    }
    catch(error) {
        console.log(error);
        setExecuteResultUI('Call','admin','', "Error, check your contract address. "+error,'',true);
    }
}

// Use the address to retrieve the existing instance of a factoryCarpooling
window.doFactorySelection = function()  {
    address = document.getElementById('contract_address_optional').value;
    FactoryInstance = createContractInstance(address, factory_abiDefinition, "");   
    getAdmin(FactoryInstance);
}

 window.doFactoryGetAdmin = function()  {
    getAdmin(FactoryInstance);
}

window.doFactoryGetCarpoolingAddressUsingIndex = function()  {
    var index = document.getElementById('index_carpooling_parameter').value;
    getCarpoolingAddressUsingIndex(FactoryInstance, index);
}

window.doFactoryCreateCarpooling = function()  {
    createCarpooling(FactoryInstance);
}


/**
 * LOGS
**/

// Gets the logs for the specific contract instance
window.doContractEventGet = async function() {
    var contractAddress = document.getElementById('contract_address_optional').value
    var contractInstance = createContractInstance(contractAddress, factory_abiDefinition, "");

    clearList('get_contract_instance_logs_list');
    setData('get_contract_instance_log_count', '---', true);

    var latest = await web3.eth.getBlockNumber()

    contractInstance.getPastEvents('CreateCarpooling', {
        fromBlock: latest - 900,
        toBlock: 'latest'
    }, function(error, events){ 
        if(error){
            console.log(" doContractEventGet func, error:", error, "events:", events);
            setData('get_contract_instance_log_count',error,true);
        } })
    .then(function(events){
        setData('get_contract_instance_log_count',events.length, false);
        for(var i = 0; i < events.length ; i++){
            addEventListItem('get_contract_instance_logs_list',events[i],50);
        }
    });
}
