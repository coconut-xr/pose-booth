/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from "react";
import {
  useInputSourceEvent,
  DynamicHandModel,
  HandBoneGroup,
  useHandPoses,
} from "@coconut-xr/natuerlich/react";
import {
  InputDeviceFunctions,
  XSphereCollider,
} from "@coconut-xr/xinteraction/react";

import { OculusHandModel } from "three-stdlib";
import { useMainStore } from "./states/MainStore.js";
import { useFrame } from "@react-three/fiber";

export default function Hand({
  hand,
  inputSource,
}: {
  hand: XRHand;
  inputSource: XRInputSource;
}) {
  const colliderRef = useRef<InputDeviceFunctions>(null); // Sphere Collider Ref
  const handRef = useRef<OculusHandModel>(null); // dynamic hand model

  // Input Events
  useInputSourceEvent(
    "selectstart",
    inputSource,
    (e) => {
      return colliderRef.current?.press(0, e);
    },
    []
  );
  useInputSourceEvent(
    "selectend",
    inputSource,
    (e) => colliderRef.current?.release(0, e),
    []
  );

  const isLeftHand = inputSource.handedness === "left";

  return (
    <>
      <DynamicHandModel
        ref={handRef}
        hand={hand}
        handedness={inputSource.handedness}
      >
        {isLeftHand ? (
          <>
            {/* For HandPosition and deviationAngle */}
            <HandBoneGroup joint={"index-finger-tip"}>
              <XSphereCollider radius={0.02} ref={colliderRef} id={-2} />
              {/* <group>
                <mesh>
                  <sphereBufferGeometry args={[0.01]} />
                </mesh>
              </group> */}
            </HandBoneGroup>
          </>
        ) : (
          <>
            <HandBoneGroup joint={"index-finger-tip"}>
              <XSphereCollider radius={0.02} ref={colliderRef} id={-2} />
              {/* <group>
                <mesh>
                  <sphereBufferGeometry args={[0.01]} />
                </mesh>
              </group> */}
            </HandBoneGroup>
          </>
        )}
      </DynamicHandModel>
    </>
  );
}
