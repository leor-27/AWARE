// Not yet included pages

Figma Link: https://www.figma.com/design/dBluo3ALBCAbpgjy3V6Xd6/AWARE-App-Design?node-id=387-3721&t=wIIUYrZIZnFzA604-1

(EC - Permissions overview, EC - Attempt log, EC - Upload status, EC - Spoken status, EC - Clear history confirmation, EC - History empty, NM - Location Map (USER), 
NM - Pick Destination (USER), NM - Location Map (CONTACT), NM - Monitoring Destination (CONTACT))


1. Open the existing Expo project
In your VS Code terminal, run:
cd /Users/gelo/.gemini/antigravity/scratch/aware-app (will depend where it is located in yours)
code .

(to enable code incase it's not:
Enable the code command
1. Press Cmd + Shift + P.
2. Search for Shell Command: Install 'code' command in PATH.
3. Click that option.
4. Close and reopen your Terminal.)


Make sure VS Code opens the aware-app folder, not just the parent folder.


2. Install the packages
Run:
npx expo install react-native-svg expo-haptics expo-speech expo-camera expo-location expo-sms


3. Run your actual mobile application
Once the dependencies are installed:

npx expo start
