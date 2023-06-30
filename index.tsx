/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from "@react-three/fiber";
import {
  XR,
  useEnterXR,
  useInputSources,
  useSessionGrant,
  useNativeFramebufferScaling,
  useHeighestAvailableFrameRate,
  useHandPoses,
} from "@coconut-xr/natuerlich/react";
import { getInputSourceId } from "@coconut-xr/natuerlich";
import { XWebPointers } from "@coconut-xr/xinteraction/react";
import Hand from "./src/Hand.js";
import InfoPanel from "./src/components/InfoPanel.js";
import { TouchHand } from "@coconut-xr/natuerlich/defaults";
import { useMainStore } from "./src/states/MainStore.js";

const sessionOptions: XRSessionInit = {
  requiredFeatures: ["local-floor", "hand-tracking", "anchors"],
};

export default function Index() {
  useSessionGrant();
  const enterAR = useEnterXR("immersive-ar", sessionOptions);
  const enterVR = useEnterXR("immersive-vr", sessionOptions);
  const frameBufferScaling = useNativeFramebufferScaling();
  const frameRate = useHeighestAvailableFrameRate();

  return (
    <>
      <div style={{ zIndex: 1, position: "absolute", top: 0, left: 0 }}>
        <button style={{ width: 100, height: 100 }} onClick={() => enterAR()}>
          AR
        </button>
        <button style={{ width: 100, height: 100 }} onClick={() => enterVR()}>
          VR
        </button>
      </div>
      <Canvas
        dpr={window.devicePixelRatio}
        shadows
        gl={{ localClippingEnabled: true }}
        style={{ width: "100vw", height: "100svh", touchAction: "none" }}
        events={() => ({ enabled: false, priority: 0 })}
      >
        <ambientLight intensity={0.2} />
        <directionalLight intensity={0.2} position={[1, 1, 1]} />
        <XR frameBufferScaling={frameBufferScaling} frameRate={frameRate} />
        <XWebPointers />
        <InputSources />
        <InfoPanel position-y={1.5} position-z={-0.8} position-x={-0.4} rotation-x={- Math.PI / 8}/>
      </Canvas>
    </>
  );
}

function InputSources() {
  const inputSources = useInputSources();
  return (
    <>
      {inputSources.map((inputSource) => (
        <XRInputSource
          inputSource={inputSource}
          key={getInputSourceId(inputSource)}
        />
      ))}
    </>
  );
}

function XRInputSource({ inputSource }: { inputSource: XRInputSource }) {
  if (inputSource == null || inputSource.handedness === "none" || !inputSource.hand ) {
    return null;
  }

  const [isRecording, startRecording, stopRecording] = useMainStore((state) => [
    state.isRecording,
    state.startRecording,
    state.stopRecording,
  ]);

  const downloadPose = useHandPoses(
    inputSource.hand,
    inputSource.handedness,
    (name, prevName) => {},
    {
      fist: "poses/fist.handpose",
      relax: "poses/relax.handpose",
      point: "poses/point.handpose",
    }
  );

  useFrame(() => {
    if (isRecording){
      if (inputSource.handedness === "right") downloadPose()
      stopRecording()
    }
  });

  return inputSource.hand != null ? (
    inputSource.handedness === "left" ? (
      // <GrabHand
      //   hand={inputSource.hand}
      //   inputSource={inputSource}
      //   id={getInputSourceId(inputSource)}
      // />
      <TouchHand inputSource={inputSource} hand={inputSource.hand} id={getInputSourceId(inputSource)} />
    ) : (
      <TouchHand inputSource={inputSource} hand={inputSource.hand} id={getInputSourceId(inputSource)}/>
    )
  ) : (
    <></>
  );
}
