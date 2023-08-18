/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import {
  useEnterXR,
  useInputSources,
  useSessionGrant,
  useHandPoses,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
} from "@coconut-xr/natuerlich/react";
import { getInputSourceId } from "@coconut-xr/natuerlich";
import InfoPanel from "./src/components/InfoPanel.js";
import { TouchHand } from "@coconut-xr/natuerlich/defaults";
import { useMainStore } from "./src/states/MainStore.js";
import { XRCanvas } from "@coconut-xr/natuerlich/defaults";
import { inputCanvasProps } from "@coconut-xr/input";

const sessionOptions: XRSessionInit = {
  requiredFeatures: ["local-floor", "hand-tracking", "anchors"],
};

export default function Index() {
  const enterAR = useEnterXR("immersive-ar", sessionOptions);
  const enterVR = useEnterXR("immersive-vr", sessionOptions);

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
      <XRCanvas
        style={{
          position: "absolute",
          inset: 0,
          touchAction: "none",
          overscrollBehavior: "none",
          userSelect: "none",
        }}
        {...inputCanvasProps}
      >
        <color args={[0]} attach="background" />
        <gridHelper args={[100, 100]}>
          <meshBasicMaterial color="#333" />
        </gridHelper>
        <directionalLight position={[1, 1, 2]} />
        <ambientLight intensity={0.6} />
        <NonImmersiveCamera position={[0, 1.6, 0.3]} />
        <ImmersiveSessionOrigin position={[0, 0, 0]} >
          <InputSources/>
        </ImmersiveSessionOrigin>
        <InfoPanel />
      </XRCanvas>
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
  if (
    inputSource == null ||
    inputSource.handedness === "none" ||
    !inputSource.hand
  ) {
    return null;
  }

  const [isRecording, stopRecording] = useMainStore((state) => [
    state.isRecording,
    state.stopRecording,
  ]);

  const downloadPose = useHandPoses(
    inputSource.hand,
    inputSource.handedness,
    (name, prevName) => {},
    {
      fist: "fist.handpose",
      relax: "relax.handpose",
      point: "point.handpose",
    }
  );

  useFrame(() => {
    if (isRecording) {
      if (inputSource.handedness === "right") downloadPose();
      stopRecording();
    }
  });

  return inputSource.hand != null ? (
    inputSource.handedness === "left" ? (
      <TouchHand
        inputSource={inputSource}
        hand={inputSource.hand}
        id={getInputSourceId(inputSource)}
      />
    ) : (
      <TouchHand
        inputSource={inputSource}
        hand={inputSource.hand}
        id={getInputSourceId(inputSource)}
      />
    )
  ) : (
    <></>
  );
}
