# TDOD:  Recording and Using Hand Poses in VR - PoseBooth Tutorial with natuerlich

Introduction:
In this tutorial, we will explore PoseBooth, a template that allows you to record hand poses, which can later be included in your own applications with natuerlich. With PoseBooth, you can easily capture hand gestures of any pose you like, and use them in your projects. We'll guide you through the process of setting up PoseBooth, recording hand poses, and incorporating them into your applications.

## Prerequisites:

Before starting this tutorial, ensure that you have the following:

1. A VR headset that supports hand tracking.
2. Basic knowledge with react-three-fiber.

## Step 1: Set up PoseBooth Project

### 1.1. Clone the GitHub Template
To get started, clone the PoseBooth GitHub template using the following command:

```
git clone https://github.com/coconut-xr/pose-booth.git
cd pose-booth
```

### 1.2. Install Dependencies and Run the Development Server
Next, install the project dependencies by running:

```
npm i
```

Launch the development server by executing the following command:

```
npm run dev
```

## Step 2: Prepare VR Environment

### 2.1. Access Your Local Development Website on VR Device

Put on your VR headset and access your locally running PoseBooth site. Ensure that your VR device is connected to the same network as your development machine.

### 2.2. Start PoseBooth Session

On the website, find the „Enter AR“  or „Enter VR“ button, and click on it to enter the PoseBooth. And throw away your controllers!

### 2.3. Record Hand Poses

You will find yourself in front of a button, that says „Start Recording Pose“ and a countdown. Click the button with your finger.
When you hear the countdown counting down, hold your hands in the desired pose you want to record, whether it's a peace sign, thumbs-up, or any other gesture you wish to capture. (We already provide default hand poses within natuerlich). After five seconds you should hear a screenshot sound and a small toast, indicating the file is saved will pop up.

## Step 3: Retrieve Hand Poses

### 3.1. Locate the Saved Hand Poses

After recording the hand pose, a file named "untitled.handpose" will be saved to your VR headset's download folder. But how do we get access to it?

### 3.2. Install Android Debug Bridge (adb)

To retrieve the hand poses from your VR headset, you'll need to have Android Debug Bridge (adb) installed on your computer.

We will be using a Mac for developing, but we will link to all Windows resources for installing and using adb

- For macOS (recommended for M1 and M2):
  Follow the instructions in this link to install adb: <https://stackoverflow.com/questions/31374085/installing-adb-on-macos>

  ```
  brew install android-platform-tools
  ```

- For Windows:
  Download adb from the official Android Developer website: <https://developer.android.com/tools/releases/platform-tools>

### 3.3. Connect VR Headset to PC and Accept the Dialog on Your VR Headset

Connect your VR headset to your computer via USB cable.
Put on your VR headset and accept any dialog that appears to grant USB debugging access to your computer.

(Photo of dialog <https://vrlowdown.com/wp-content/uploads/2022/06/oculus-quest-2-link-cable-not-detected-2.jpg>)

Make sure you have turned on the USB connection dialogue in your „Developer“ Settings
 ( <https://vrlowdown.com/wp-content/uploads/2022/06/oculus-quest-2-link-cable-not-detected-1.jpg>)

## Step 4: Retrieve Hand Poses with adb and include them in your project

### 4.1. Launch adb

- For macOS:
  Open a terminal window and run the following command:

  ```
  adb devices
  ```

  This should automatically open a window where you can access the "Downloads" folder on your VR headset.
(Screenshot)

### 4.2. Copy Hand Poses to Your Project

Locate the "untitled.handpose" files or any other poses you recorded in the PoseBooth. Copy these files to your project's public folder.

### 4.3. Rename and Include Hand Poses in Your Code

Rename each file according to the pose it represents (e.g., thumbsUp.handpose). Include these hand poses in your application's code using the useHandPoses hook.  
(Code)

```tsx
import { XRCanvas } from "@coconut-xr/natuerlich/defaults";
import { getInputSourceId } from "@coconut-xr/natuerlich";
import { useState } from "react";
import {
  useEnterXR,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
  useInputSources,
  useHandPoses
} from "@coconut-xr/natuerlich/react";
import { RootContainer, Text } from "@coconut-xr/koestlich";

const sessionOptions: XRSessionInit = {
  requiredFeatures: ["local-floor", "hand-tracking"]
};

export function PoseHand({
  hand,
  inputSource,
  setPoseNames
}: {
  hand: XRHand;
  inputSource: XRInputSource;
  setPoseNames: (names: string) => void;
}) {
  useHandPoses(
    hand,
    inputSource.handedness,
    (name, prevName) => {
      console.log(name, prevName);
      setPoseNames(`${name}, ${prevName}`);
    },
    {
      fist: "fist.handpose",
      relax: "relax.handpose",
      point: "point.handpose"
    }
  );

  return null;
}

export default function Index() {
  const enterAR = useEnterXR("immersive-ar", sessionOptions);
  const inputSources = useInputSources();
  const [leftPoseNames, setLeftPoseNames] = useState("none");
  const [rightPoseNames, setRightPoseNames] = useState("none");
  return (
    <div
      style={{...}}
    >
      <button onClick={enterAR}>Enter AR</button>
      <XRCanvas>
        <group position={[0, 1.5, 0]}>
          <RootContainer anchorX="center" anchorY="center">
            <Text>{`Left: ${leftPoseNames}`}</Text>
            <Text>{`Right: ${rightPoseNames}`}</Text>
          </RootContainer>
        </group>
        <NonImmersiveCamera position={[0, 1.5, 4]} />
        <ImmersiveSessionOrigin position={[0, 0, 4]}>
          {inputSources.map((inputSource) =>
            inputSource.hand != null ? (
              <PoseHand
                setPoseNames={
                  inputSource.handedness === "left"
                    ? setLeftPoseNames
                    : setRightPoseNames
                }
                key={getInputSourceId(inputSource)}
                inputSource={inputSource}
                hand={inputSource.hand}
              />
            ) : null
          )}
        </ImmersiveSessionOrigin>
      </XRCanvas>
    </div>
  );
}
```

(Link to natuerlich docs <https://coconut-xr.github.io/natuerlich/#/./poses> )

Conclusion:
Congratulations! You've learned how to use PoseBooth to record hand poses and incorporate them into your own application. With this feature, you can enhance the user experience by allowing them to interact using various hand gestures. Experiment with different poses and create stunning immersive VR experiences. Happy coding!

