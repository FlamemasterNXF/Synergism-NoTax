# Synergism Plus
## Modding
### Getting Started
Welcome to Synergism Plus! Here's a quick and easy to understand guide on how to get started making your own mod!<br>
To start simply `fork` this Repository and clone it to your local machine.<br>
Once you've done that open it up in your code editor of choice (preferably Visual Studio Code) and open up the Terminal.<br>
Once you've opened the Terminal run `npm install` to install all dependencies. This is very important, the project will not work without it! <br>
If you've completed all these steps you're ready to move on to the next section!

### Adding a new Mod Toggle
Congrats on completing the first section! This short section will show you how to create the Mod Toggle for your Mod!<br>
Go to `src/Variables.html` line 433. This is where all the mod data is stored.<br>
You should add a new block of code that looks like this:
```javascript
{
    title: "yourTitleHere",
    desc: "yourDescriptionHere",
    author: "yourUsernameHere",
    id: "modIDhere"
},
```
Be sure to use a unique mod ID or both mods will be broken. An easy way to check is to open the console while testing.<br>

### Running your Mod locally
Running your Mod locally only takes 3 simple steps!<br>
1. Open up `index.html` in your browser of choice.
2. Go back to your code editor, open the terminal and run `npm run build:esbuild`.
3. Go back to your browser and refresh the page.

Your Mod should now be running locally! If you make a update to your Mod but still have the page open simply repeat steps 2 and 3 to see all your new changes.

### Coding your Mod
This is the part where I have to leave you to your own devices.<br>
From here you can venture into the code and modify whatever you please, just be careful to fix any errors that you may cause!<br>
Important: Make sure whatever effect your Mod has only runs when the toggle is enabled. Thanks :)<br>
You can check if your Mod is toggled by using a simple if statment: `if(inMod("modID"))`<br>
Add a new variable to the player by going to `src/types/Synergism.d.ts` and adding the type of variable (Decimal, number, string, or Decimal[] for an array). Then go to `src/Synergism.ts` and add the variable there.<br>
Have fun!

### Adding your Mod to Synergism Plus
Are you finished with your Mod and ready to share it with the world? Here's a simple guide on how to do that!<br>
First, be sure there are no errors. No Mods that cause errors will be added, sorry (unless your error is at `hotkeys.ts:107`).<br>
Then simply create a PR (pull request) to the Synergism Plus repo, I'll merge it as soon as I see it! Once I do your Mod will be on the main site!
