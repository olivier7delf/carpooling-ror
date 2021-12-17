# User Interface to test the smart contract: Carpooling

This project integrates notions of:
- Blockchain, based on the project  https://github.com/olivier7delf/carpooling-poc
- Web using web3.js and Ruby on Rails

The UI is meant to test functionalities in test and production environments.
If you are interested in UI design with RoR & bootstrap (No blockchain): https://github.com/olivier7delf/Bro-Bet

Tech:
- Blockchain:
  - Solidity - 0.5.16 (solc-js)
  - Truffle v5.4.18 (core: 5.4.18)
  - Node v14.18.0
  - Web3.js v1.5.3
  - Ganache app

- Web:
  - web3@1.6.1
  - Ruby 2.7.3p183
  - Rails 6.0.4.1
  - Bundler version 2.2.27
  - yarn 1.22.13

## Contents
1. Installation and folders of interest
2. Description and functionnalities
3. Next steps


# 1) Installation and folders of interest

## a) Command lines
Download the repo, then
>bundle install

Check it is working
>rails s

and go on localhost

Test that truffle is working.(optional)

Modify its setup if needed, regarding your local blockchain.

## b) Main folders:

Where to look in the repository to do update.

### Solidity
contracts/...

builds/... (ABI and bytecode)

### JS
app/javascript/packs/application.js

### Views (html.erb)
app/views/pages/home.html.erb

### CSS
app/assets/stylesheets/applications.scss

# 2) Description and functionnalities

# What can I do with the interface?
Connect to a blockchain:
- Locally: using ganache (caution to the setting truffle-config.js and ganache)
          or you can setup a local blockchain
- Polygon mumbai: using Metamask
- Polygon mainnet: using Metamask

Interact with CarpoolingFactory.

Interact with Carpooling. (TODO)

# How to use it?
locally: type the http local url

Polygon: clear it, and click on connect.
- A popup will ask to connect to your wallet, accept. (! Always use a sandbox Wallet with a few Matics to avoid any issues !)

You can:

CarpoolingFactory
- Deploy a factory contract, take care of the gas required
- Retrieve an existing instance of the factory contract: using its address
- Get the admin of the factory instance
- get the carpooling address using its index
- Create a carpooling: take care of the gas price
  Input data are already set to facilitate testing (todo->allow inputs)
- logs events of the last 900 blocks filtered on createCarpooling of factory instance

# 3) Next step: TODO

VIEWS:
Split:
- home: account, send, unlock
- carpooling factory: factory related topics + get carpooling index (easier for testing...)
- carpooling: carpooling related topics

CarpoolingFactory: 
- add services
- createCarpooling: allow user parammeter in input
...

Carpooling 
- Ask to book a carpooling
- Validate a booking
- Validate a trip
- Withdraw your tokens
...


