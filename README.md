# VirtualTable

## What Is Virtual Table?
Virtual tables aim is to become a open source alternative to online character management for DnD and other table top RPGs. Currently it is in very early development however in time we hope to be able to support a wide array of functions such as:
* Combat tracking for GMs
* Making Characters quickly that may involve Home Brew Content
* NPC tracker
* Monster, spell, item lookups that can be easily added to

## Getting Setup:
### Dependencies
Virtual table runs using Node JS and uses Mongodb for data storage as such both of these are required for Virtual Table to run.
You can download them here:
* [Node JS](https://nodejs.org/)
* [Mongodb](https://www.mongodb.com/)

Its also worth mentioning that storage may become an issue over time as you use this application so ensure you have adequte storage on whatever machine you are running it on.
### Installing
1) Clone this repo ```git clone https://github.com/TartarusKelvin/VirtualTable```
2) Run npm install in the Virtual Table folder ```npm install```
3) Create a file named ```.env``` and add the line ```DATABASE_URL=``` along with your monogodb url
4) Start the application ```npm run devStart```
