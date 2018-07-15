# Create your own Facebook Messenger bot!

In this guide, you will learn how to setup a fully functional Facebook Messenger Chatbot that can be tested in real-time locally. The bot in this guide is coded using JavaScript.

All the files you will need are available above: [index.js](../master/index.js), [package.json](../master/package.json), and [.gitignore](../master/.gitignore)

## Testing your bot locally

Follow these steps to update your bot as you change your code.

Through terminal and in your bot's folder, execute the following code:

```
$ git add .
$ git commit -m “message about what you’re changing”
$ git push heroku master
```

After that, message your bot and the changes should be updated :)

For advanced debugging: go to your Heroku account, select the server your bot is on, click "More", and finally select "View Logs".

## Built With

* [Node](https://nodejs.org/en/) - The JavaScript engine used
* [Heroku](https://devcenter.heroku.com/articles/heroku-command-line#download-and-install) - Server
* [git](https://git-scm.com/downloads) - Used to push changes

## Authors

* **Jay Syz**  - server side setup

* **Sasha Boginsky** - client side code for Chephbot
