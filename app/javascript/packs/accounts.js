
import {
    setData, removeAllChildItems,
     addAccountsToList, addAccountsToSelects,
     addAccountBalancesToList, createEtherscanIoUrl, createTransactionObjectJson
    } from "./utils.js";

// Holds the accounts
var accounts;

window.createAccount = function() {
    var password_new = document.getElementById('account_new_password').value;
    web3.eth.personal.newAccount( password_new, 
        function (error, result) {
            var account_created_address = result;
            setData("account_created_address", account_created_address, false);
        }
    );
}

window.doGetAccounts = function() {
    
    web3.eth.getAccounts(function (error, result) {
        if (error) {
            setData('accounts_count', error, true);
        } else {
            accounts = result;
            setData('accounts_count', result.length, false);
            // You need to have at least 1 account to proceed
            if(result.length == 0) {
                if(nodeType == 'metamask'){
                    alert('Unlock MetaMask *and* click \'Get Accounts\'');
                }
                return;
            }

            // Remove the list items that may already be there
            removeAllChildItems('accounts_list');
            // Add the accounts as list items
            for (var i = 0; i < result.length; i++) {
                addAccountsToList('accounts_list',i,result[i])
            }
            
            var coinbase = result[0];
            
            // trim it so as to fit in the window/UI
            if(coinbase) coinbase = coinbase//.substring(0,25)+'...'
            setData('coinbase', coinbase, false);
            // set the default accounts
            var defaultAccount = web3.eth.defaultAccount;
            if(!defaultAccount){
                web3.eth.defaultAccount =  result[0];
                defaultAccount = '[Undef]' + result[0];
            }

            defaultAccount = defaultAccount.substring(0,25)+'...';
            setData('defaultAccount', defaultAccount, false);
        }
        // Get the balances of all accounts doGetBalances
        doGetBalances(accounts)

        // This populates the SELECT boxes with the accounts
        addAccountsToSelects(accounts);
    });
}

/**
 * Get the balances of all accounts.
 */
 function    doGetBalances(accounts) {

    // Remove the balances if they already exist
    removeAllChildItems('account_balances_list');
    
    // Add the balances as the list items
    for (var i = 0; i < accounts.length; i++) {

       // var bal = web3.eth.getBalance(accounts[i]);
       web3.eth.getBalance(accounts[i], web3.eth.defaultBlock, function(error,result){
           // Convert the balance to ethers
            var bal = (web3.utils.fromWei(result,'ether')*1).toFixed(2);
            addAccountBalancesToList('account_balances_list',i,bal);
        });
    }
}

window.doUnlockAccount = function()  {
    setData('lock_unlock_result','...',true);
    var account = document.getElementById('select_to_unlock_account').value;
    var password = document.getElementById('unlock_account_password').value;
    unlock(account, password);
}

function unlock(account, password){
    web3.eth.personal.unlockAccount(account, password, 2*3600, function(error, result)  {

        // console.log(error,result)
        if(error){
            setData('lock_unlock_result',error,true);
        } else {
            // Result = True if unlocked, else false
            var str = account.substring(0,20)+'...Unlocked';
            if(result){
                setData('lock_unlock_result',str,false);
            } else {
                // This does not get called - since and error is returned for incorrect password :-)
                str = 'Incorrect Password???';
                setData('lock_unlock_result',str,true);
            }
            
            
        }
    });
}

/**
 * Lock the account
 */
 window.doLockAccount = function() {

    setData('lock_unlock_result','...',true);
    var account = document.getElementById('select_to_unlock_account').value;
    //Synchronous flavor
    //web3.personal.lockAccount(account)

    web3.eth.personal.lockAccount(account, function(error, result){

        console.log(error,result)
        if(error){
            setData('lock_unlock_result',error,true);
        } else {
            var str = account.substring(0,20)+'...Locked';
            setData('lock_unlock_result',str,false);
        }
    });
}


window.doSetDefaultAccount = function() {
    var new_default_acc = document.getElementById('edit_default_account_address').value;
    web3.eth.getAccounts().then((accounts) => {
        for (var i = 0; i < accounts.length; i++) {
            if (new_default_acc.toLowerCase() === accounts[i].toLowerCase()){
                web3.eth.defaultAccount = new_default_acc;
                setData('default_account_address', 'Default account: '+web3.eth.defaultAccount, false);
                break;
            }
            if (i === accounts.length-1){
                new_default_acc = '';
            }
        }
    }) 
}

window.doCoinbaseCall = function()  {
    web3.eth.getCoinbase(function(error, coinbase) {
        if(error){
            setData('coinbase_address','coinbase error: '+error,true);
        }else{
            setData('coinbase_address', 'coinbase: '+coinbase, false);
            if (web3.eth.defaultAccount===null){
                web3.eth.defaultAccount = coinbase
            }
        }
    })
    setData('default_account_address', 'Default account: '+web3.eth.defaultAccount, false);
}

window.doSendTransaction = function()  {

    var transactionObject = createTransactionObjectJson();
    // miner.start(mining_threads);
    web3.eth.sendTransaction(transactionObject, function(error, result) {

        if(error){
            setData('send_transaction_error_or_result', error, true);
        } else {
            setData('send_transaction_error_or_result', result, false);
            // set the link to ether scan
            var etherscanLinkA=document.getElementById('etherscan_io_tx_link');
            etherscanLinkA.href = createEtherscanIoUrl('tx',result);
            etherscanLinkA.innerHTML='mumbai.polygonscan'
            //console.log(etherscanLinkA)
        }
    });
}

export {accounts};