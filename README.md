## About AWARE

AWARE is an accessibility app designed to support blind and visually impaired users with Smart Vision object detection, spoken and vibration feedback, navigation, and emergency SOS messaging to trusted contacts. Trusted contacts can view a connected user’s shared location and receive SOS alerts.

GROUP 1
Bandola, Josephine Joy L. (Project Lead)
Agpoon, Leo Angelo Larre P. (Lead Developer)
Balindo, Theresa V. (UI/UX Designer)
Laganson, Ynjel Jayelm C. (Data Analyst)


AI Assistance Used In Project: Codex, Antigravity


## Links

Figma Link: https://www.figma.com/design/dBluo3ALBCAbpgjy3V6Xd6/AWARE-App-Design?node-id=387-3721&t=wIIUYrZIZnFzA604-1

Vercel Link: https://aware-peach.vercel.app


## Run the app

Run AWARE locally:

1. Open the project

Open a terminal and change to the folder containing the AWARE project:
```
cd /path/to/aware-app
code .
```
Replace /path/to/aware-app with the location of your project. Make sure VS Code opens the aware-app folder itself.

If the code command isn’t available, open VS Code, press Cmd + Shift + P, search for Shell Command: Install 'code' command in PATH, and select it. Then restart the terminal.

2. Install dependencies
   
In the project folder, run:
```
npm ci
```

3. Run the app
Open in a browser:
```
npx expo start --web
```
Open with Expo Go:
```
npx expo start
```

Scan the QR code with Expo Go on your phone. Your phone and computer should be on the same network.


## Demo accounts

Choose the matching role on the login screen and enter the credentials:

| Role | Email | Password |
| Blind individual | jeremylcinco@gmail.com | jeremy |
| Trusted contact | josephinedlsantos@gmail.com | josephine |


## Android volume-button shortcut

The volume-button SOS shortcut requires a custom Android build with the AWARE accessibility service enabled in Android Settings. It is not available in Expo Go or the Vercel browser preview.
