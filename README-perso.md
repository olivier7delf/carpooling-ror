Rails app generated with [lewagon/rails-templates](https://github.com/lewagon/rails-templates), created by the [Le Wagon coding bootcamp](https://www.lewagon.com) team.

rails new \      
  --database postgresql \
  -m https://raw.githubusercontent.com/lewagon/rails-templates/master/minimal.rb \
  carpooling-ror

Check working:
rails s

# Solidity & truffle setup
packages:
yarn add web3


truffle init // do not create test

mkdir test-solidity 
and rename migration to migration-solidity

touch contracts/HelloWorld.sol
touch migrations-solidity/2_deploy_contracts.js

Add in packages.json
"file-saver": "^2.0.5", // Just because there is the possibility to save a address in a file.
"web3": "^1.6.1"

then:
yarn install

# JS
edit app/javascript/packs/
application.js & utils.js

# CSS
edit app/assets/stylesheets/applications.scss

# Views (html.erb)
app/views/pages/home.html.erb


# What can i do with the interface?
Connect to a blockchain:
- Localy: using ganache (caution to the setting truffle-config.js and ganache)
          or you can setup a local blockchain
- Polygon mumbai: using Metamask
- Polygon mainnet: using Metamask (event logs soon available)

Interact with CarpoolingFactory.
Interact with Carpooling. (TODO)

# How to use it?
localy: type the http local url
Polygon: clear it, and click on connect.
- Popup will ask to connect to your wallet, accept. (! Always use sandbox Wallet with few Matics to avoid any issues !)

You can:

CarpoolingFactory
- Deploy a factory contract, take care about the gas require
- Retrieve an existing instance of the factory contract: using its address
- Get the admin of the factory instance
- get the carpooling address using its index
- Create a carpooling: take care about the gas price
  Input data are already set to facilitate testing (todo->allow inputs)
- logs events of the last 900 blocks filtered on createCarpooling of factory instance

(TODO)

VIEWS:
Split:
- home: account, send, unlock
- carpooling factory: factory related topics + get carpooling index (easier for testing...)
- carpooling: carpooling related topics

CarpoolingFactory: add services

Carpooling 
- Ask to book a carpooling
- Validate a booking
- Validate a trip
- Withdraw your tokens
...


