# Favorite Channels

Favorite Channels is a web app that helps you follow up with your favorite Youtube subscriptions by categorizing channels according to your areas of interest.

## How to get started

1. Access the home page
2. Insert your youtube channel ID and click continue. Instructions on how to find it: https://support.google.com/youtube/answer/3250431
3. Create a folder and select channels from the "Uncategorized" channels list
4. Sign up to save preferences
5. A badge will indicate recently uploaded videos
6. Click on the channel to access the list of recently uploaded videos
7. Click on the video to watch it on Youtube

## User stories

- User can categorize channels in folders
- User can check channel notifications
- User can log in/create an account

## Features

- Users can sign up and save preferences
  - database and authentication were implemented with Firebase services
- Recent subscriptions will appear on the "Uncategorized" folder
  - calls Youtube API to get user's subscriptions
- Unseen notifications will appear in a badge on top of the channel thumbnail
  - calls Youtube API to get channels activities
- Channels are sorted in decreasing order of unseen notifications
- Language support for pt-BR and en-US
  - by using i18next internalization-framework

## How to run a copy of the app locally on your machine

1. Either fork or clone the repository
2. Open the folder in the CLI and install dependencies by using the `npm i` command
3. Rename .env.template file to .env.local and make sure to fill out all environment variables
4. Start the webserver by using the `npm run dev` command
5. Go to http://localhost:3000 to get started using the web app

## Screenshots

- Getting started:
  ![favorite_channels-getting_started](https://user-images.githubusercontent.com/43918107/144124154-29ebf3bc-f189-41b5-9754-e0739a873ee6.png)

- Categorized & channel notifications:
  ![favorite_channels-notifications](https://user-images.githubusercontent.com/43918107/144124411-df88c17d-dd0a-4965-a82b-662eb53e2a4c.png)

- Uncategorized subscriptions:
  ![favorite_channels-uncategorized_folder](https://user-images.githubusercontent.com/43918107/144124521-813bab17-9c2a-4192-9f32-a4d9c1ff1e73.png)
