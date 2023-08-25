/* eslint-disable react/no-unknown-property */
import {
  useEnterXR,
  useInputSources,
  useHandPoses,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
} from "@coconut-xr/natuerlich/react";
import InfoPanel from "./src/components/InfoPanel.js";
import { Hands } from "@coconut-xr/natuerlich/defaults";
import { useMainStore } from "./src/states/MainStore.js";
import { XRCanvas } from "@coconut-xr/natuerlich/defaults";
import { inputCanvasProps } from "@coconut-xr/input";
import { useEffect } from "react";

const sessionOptions: XRSessionInit = {
  requiredFeatures: ["local-floor", "hand-tracking"],
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
        <ImmersiveSessionOrigin position={[0, 0, 0]}>
          <DownloadRightHandPose />
          <Hands type="touch" />
        </ImmersiveSessionOrigin>
        <InfoPanel />
      </XRCanvas>
    </>
  );
}

function DownloadRightHandPose() {
  const inputSources = useInputSources();
  const rightHandInputSource = inputSources.find(isRightHand);
  if (rightHandInputSource == null) {
    return null;
  }
  return <ForwardDownloadPose inputSource={rightHandInputSource} />;
}

const { setDownloadPose } = useMainStore.getState();

function ForwardDownloadPose({
  inputSource,
}: {
  inputSource: XRInputSource & { hand: XRHand };
}) {
  const downloadPose = useHandPoses(
    inputSource.hand,
    inputSource.handedness,
    () => {},
    {}
  );

  useEffect(() => {
    setDownloadPose(downloadPose);
    return () => setDownloadPose(undefined);
  }, [downloadPose]);

  return null;
}

function isRightHand(
  val: XRInputSource
): val is XRInputSource & { hand: XRHand } {
  return val.handedness === "right" && val.hand != null;
}
