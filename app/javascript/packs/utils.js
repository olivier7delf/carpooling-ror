/**
 * Contains utility functions for managing the UI
 */

 import {contract_abidefinition, contract_bytecode} from "./factory.js";

 import {nodeType} from "./application.js";


// Holds the base URL for mumbai.polygonscan
var mumbaiScanBaseUrl='https://mumbai.polygonscan.com/';


export function setData(docElementId, html, errored) {
    document.getElementById(docElementId).innerHTML = html;
    if (errored) document.getElementById(docElementId).classList = 'notready';
    else document.getElementById(docElementId).classList = 'ready';
}


// Since some of the functons/API are not available based on the
// Node type - this function disables certainelements
export function    setUIBasedOnNodeType(){
    // Unlock Account - Check the node type
    if(nodeType === 'metamask' || nodeType == 'testrpc'){
        setData('lock_unlock_result','Unlock / lock ( ) not supported for '+nodeType,true);
    } else {
        setData('lock_unlock_result','--',false);
    }

    // This simply creates the JSON for default transaction object
    generateTransactionJSON();
}


/**
 * Creates a list item for the account in the account list
 */
export function addAccountsToList(listId,index,account){
    var li = document.createElement('LI');
    var input = document.createElement('INPUT')
    input.value = account;
    input.id = 'account'+index;
    input.disabled=true;
    li.appendChild(input)
    var list = document.getElementById(listId);
    list.appendChild(li)
}


/**
 * Creates a list item for the balance in the account balance list
 */
export function addAccountBalancesToList(listId,index,accountBalance){
    var li = document.createElement('LI');
    li.class='ready'
    var input = document.createElement('P');
    input.class = 'ready';
    input.innerText=accountBalance+' Ether';
    li.appendChild(input);
    var list = document.getElementById(listId);
    list.appendChild(li)
}

/**
 * Removes all of the <li> in List
 */
export function removeAllChildItems(elementId){
    var ele = document.getElementById(elementId);
    while (ele.hasChildNodes()) {   
        ele.removeChild(ele.firstChild);
    }
}

/**
 * This populates all <SELECT> boxes with accounts
 */
export function    addAccountsToSelects(accounts){
    
    removeAllChildItems('send_from_account');
    removeAllChildItems('send_to_account');
    removeAllChildItems('select_to_unlock_account');
    for (var i = 0; i < accounts.length; i++) {
        addOptionToSelect('send_from_account', accounts[i].substring(0,15)+'...', accounts[i]);
        addOptionToSelect('send_to_account', accounts[i].substring(0,15)+'...', accounts[i]);
        addOptionToSelect('select_to_unlock_account', accounts[i].substring(0,15)+'...', accounts[i]);
    }
}

/**
 * Add options to a <select>
 */
function    addOptionToSelect(selectId, text, value){
    var option = document.createElement('OPTION');
    option.text = text;
    option.value = value;
    var select = document.getElementById(selectId);
    select.appendChild(option)

    // lets try data list add 
    // select = document.getElementById("browsers");
    // option = document.createElement('OPTION');
    // option.text=text
    // select.appendChild(option)
}

/**
 * This function creates the transaction object by reading the input elements
 */
export function    createTransactionObjectJson(){
    var transObject = {};
    // get the from and to account 
    transObject.from = document.getElementById('send_from_account').value;
    transObject.to = document.getElementById('send_to_account_value').value;
    // Get the value in ether and convert to wie
    var valueInEther = document.getElementById('send_value_in_ether').value
    var valueInWei = web3.utils.toWei(valueInEther,'ether');
    transObject.value = valueInWei;
    // set the gas and gasPrice
    if(document.getElementById('send_gas').value !== 'default')
        transObject.gas = document.getElementById('send_gas').value;
    if(document.getElementById('send_gas_price').value !== 'default')
        transObject.gasPrice = document.getElementById('send_gas_price').value;
    // set the data
    if(document.getElementById('send_data').value !== 'default'){
        // convert the ascii to hex
        var data = document.getElementById('send_data').value;
        transObject.data = web3.toHex(data);
    }
    // set the nonce
    if(document.getElementById('send_nonce').value !== 'default')
        transObject.nonce = document.getElementById('send_nonce').value;

    return transObject;
}

// The byte code for the 
function copyBytecodeInterfaceToUI(){
    document.getElementById('compiled_bytecode').value=(contract_bytecode);
    document.getElementById('compiled_abidefinition').value=(contract_abidefinition);
}

/**
 * Populates the JSON for transaction object
 */
window.generateTransactionJSON = function(){
    var tobject = createTransactionObjectJson();
    setData('send_transaction_object_json',JSON.stringify(tobject,undefined,2),false)
}

/**
 * Resets the value in the transaction object input values
 */
window.resetTransactionObjectParameters = function(){
    document.getElementById('send_to_account_value').value = '';
    document.getElementById('send_gas').value = 'default';
    document.getElementById('send_gas_price').value = 'default';
    document.getElementById('send_data').value = 'default';
    document.getElementById('send_nonce').value = 'default';
    document.getElementById('send_value_in_ether').value = 0;
    generateTransactionJSON();
}

/**
 * Create the etherscan link
 */
export function    createEtherscanIoUrl(type,hashOrNumber){

    // For TestRPC - this URL will have no meaning as the
    // Etherscan.io will not know about the Tx Hash

    var url = mumbaiScanBaseUrl;
    if(type === 'tx'){
        url += 'tx/'+hashOrNumber;
    } else if(type === 'block'){
        url += 'block/'+hashOrNumber;
    } else if(type === 'address'){
        url += 'address/'+hashOrNumber;
    } 
    return url;
}

/**
 * Sets the href in the <a> tag for etherscan.io
 */
export function   setPolygoncanLink(aId, type, hashOrNumber){
    var etherscanLinkA=document.getElementById(aId);
    etherscanLinkA.href = createEtherscanIoUrl(type,hashOrNumber);
    if(hashOrNumber)
        etherscanLinkA.innerHTML='etherscan.io';
    else
        etherscanLinkA.innerHTML='';
}

/**
 * Sets the Result UI components for the Execute call
 */
export function    setExecuteResultUI(callType,functionName, parameter, return_value, txHash, error){
    var detail = callType+':'+functionName+'('+parameter+') ';
    if(error)  detail += ' FAILED: ';
    else detail += 'Successful: ';
    setData('invoke_details_'+functionName,detail + return_value,(error));
    // setData('invoke_return_value_'+functionName,return_value,(error));
    if (callType!="Call"){
        setData('invoke_contracttransactionhash_'+functionName, txHash, false);
        setPolygoncanLink('invoke_contracttransactionhash_link_'+functionName, 'tx', txHash);
    }
}

/**
 * Adds a list element in the 0th position
 * Removes the last element if the length exceeds provided ln
 */
export function    addEventListItem(listId, childData, len){
    
    console.log('Event:',childData);

    // check length
    var list = document.getElementById(listId);
    if(list.childNodes.length >= len){
        var i = list.childNodes.length - 1; // last child
        list.removeChild(list.childNodes[i]);
    }
    // Create the List Item for the events list
    var li = document.createElement('LI');

    // Add new event in the 0th position
    li.appendChild(createEventListItem(childData));
    list.insertBefore(li, list.childNodes[0]);
}

// Creates the item in the events list
function    createEventListItem(childData){
    var div = document.createElement('SPAN');
    var p = document.createElement('A');
    p.text = 'Log#'+childData.logIndex+', Txn#'+childData.transactionIndex;
    div.appendChild(p);
    var aLink = document.createElement('A')
    //Add block info link
    aLink.text = ', Blk#'+childData.blockNumber;
    aLink.href = createEtherscanIoUrl('block', childData.blockNumber);
    aLink.target='_blank';
    div.appendChild(aLink);
    // Add txn info link
    if(childData.transactionHash){
        aLink = document.createElement('A')
        aLink.text = ', Txn, ';
        aLink.href = createEtherscanIoUrl('tx', childData.transactionHash);
        aLink.target='_blank';
        div.appendChild(aLink);
    }
    // Address
    if(childData.address){
        aLink = document.createElement('A')
        aLink.text = 'Addr';
        aLink.href = createEtherscanIoUrl('address', childData.address);
        aLink.target='_blank';
        div.appendChild(aLink);
    }
    return div;
}

/**
 * Clears the items from a list element on the HTML page
 */
export function    clearList(listId){
    var list = document.getElementById(listId);
    for(var i=list.childNodes.length-1; i>=0 ;i--){
        list.removeChild(list.childNodes[i]);
    }
}

/**
 * Adds the CONTRACT watch event to the list box 
 */
function    addContractEventListItem(listId, childData, len){
    console.log(JSON.stringify(childData))
}



