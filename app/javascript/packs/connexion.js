import {setData, setUIBasedOnNodeType} from "./utils.js";

// Maintains the info on node type
export var nodeType;
var provider;



const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  return false;
}

window.addEventListener('load', function() {
    doConnect();
  })

//  function doConnect()
 window.doConnect = async function ()  {
     // Set the connect status on the app

     provider = document.getElementById('provider_url').value;
    
     if(provider.slice(0,17)!="http://localhost:"){
         await ethEnabled();
     }else{
        window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
     }

     //web3 && web3.eth.net.isListening() // other than metaMask
    if (web3) {
        setData('connect_status','Connected', false);
        // Gets the version data and populates the result UI
        await setWeb3Version();
        doCoinbaseCall();
        doGetAccounts();
    } else {
        setData('connect_status','Not Connected', true);
    }

    if(nodeType != 'metamask'){
        doGetNodeStatus();
    }
}

async function    setWeb3Version() {
    await web3.eth.getNodeInfo(function(error, result){
        if(error) setData('version_information',error,true);
        else {
            setData('version_information',result,false);

            if(result.toLowerCase().includes('metamask')){
                nodeType = 'metamask';
            } else if(result.toLowerCase().includes('testrpc')){
                nodeType = 'testrpc';
            } else {
                nodeType = 'geth';
            }

            // set up UI elements based on the node type
            setUIBasedOnNodeType();
        }
    });
}

/**
 * Uses the web3.net status to check if the client is listening and peer count. KO on Metamask
**/

 window.doGetNodeStatus = function() {
    web3.eth.net.isListening(function(error, result){
        if(error) setData('get_peer_count',error,true);
        else {
            // Since connected lets get the count
            web3.eth.net.getPeerCount(  function(  error,  result ) {
            if(error){
                setData('get_peer_count',error,true);
            } else {
                setData('get_peer_count','Peer Count: '+result,(result == 0));
            }
        });
        }
    });

    web3.eth.isSyncing(function(error, result){
        if(error) setData('get_is_syncing',error,true);
        else {
            setData('get_is_syncing','Is syncing: '+result,(result == 0));
        }
    });

    web3.eth.isMining(function(error, result){
        if(error) setData('get_is_mining',error,true);
        else {
            setData('get_is_mining','Is mining: '+result,(result == 0));
        }
    });   
}