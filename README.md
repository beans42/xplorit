# xplorit

NOTE: This project was developed as part of [turnerhacks 2021]([https://turnerhacks2021.devpost.com/](https://devpost.com/software/xplorit).

xplorit is a fun [geocaching-like](https://en.wikipedia.org/wiki/Geocaching) game designed to promote exploration and exercise.

## Usage

First, ensure that ssl/privkey.pem, and ssl/fullchain.pem files are present (you can use [letsencrypt](https://letsencrypt.org/) for free ssl certs).

```bash
npm i
node index.js
```

And you're done! The app is now running on port 443.

## Inspiration

Considering the tumultuous times we live in, it is only fair to search for a solution to a problem plaguing many today. Ever since the start of the pandemic, global fitness rates have been on a sharp decline due to a plethora of reasons. One of those stems from a lack of engagement/motivation outside of our newly confined lives. For that purpose, we chose to create the web app, “Xplorit”, tasked with expanding our small horizons into the great outdoors.

## What it does

Xplorit is a competitive game in which players are provided with a compass linked to a Global Positioning System (GPS) and are incentivized to explore different areas. Essentially, random coordinates are pinpointed in a set radius defined by the player. The task is to go and explore the secret location in a given timeframe, that depending on results gives the reward of points. These points are then used to form regional leaderboards to compete against others, thus, encouraging physical activity. This web app provides users a wonderful opportunity to be physically active, traverse their neighbourhood, and explore places they have not before. Xplorit provides an enjoyable experience to those looking for an exciting, adventurous, and competitive game.

## How we built it

We built this web app using node.js with the express.js library and socket.io for client-server communication. For the user interface, we used the ionic framework of UI components.

## Challenges we ran into

As is standard in the creation of most coding projects, time was spent debugging the software so that no issues would come up in use. A larger issue encountered was finding and using viable data when it came to calculating distance travelled in relation to height/weight (for future implementation). This took much longer than expected, but in the end adequate results were found. We also ran into some problems with bad documentation, some components existed in the documentation, but were not accessible in the code.Besides problems we had while coding, a more prevalent issue was managing time effectively such that each group member could contribute in an efficient manner while also getting various elements of the project done. However, as time passed and the group became more comfortable with the ideas at hand, it became easier to delegate tasks and complete them on time.

## What we learned

This hackathon gave us the wonderful opportunity to learn various new things, it broadened our knowledge of coding and web app creation. We got a chance to learn how to use the ionic framework to actually construct our web app along with a geolocation API which helps guide the users to the secret location. When we started to plan the future machine learning integration, we learned how to correctly/logically implement/sort data and create a GUI.
