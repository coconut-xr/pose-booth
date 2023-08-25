import { RootContainer, Text } from "@coconut-xr/koestlich";
import { GroupProps } from "@react-three/fiber";
import { useMainStore } from "../states/MainStore.js";
import { Button, Glass } from "@coconut-xr/apfel-kruemel";

export default function DebugPanel({ ...props }: GroupProps) {
  return (
    <group {...props} rotation-y={0}>
      <group>
        <RootContainer
          dragThreshold={32}
          position={[0, 1.6, -0.2]}
          pixelSize={0.001}
        >
          <Glass
            minWidth={200}
            borderRadius={8}
            padding={4}
            justifyContent="center"
          >
            <Counter />
          </Glass>
        </RootContainer>
      </group>
    </group>
  );
}

const { startCountDown } = useMainStore.getState();

function Counter() {
  const counter = useMainStore(({ counter }) => counter);
  const rightHandPresent = useMainStore(
    ({ downloadPose }) => downloadPose != null
  );
  return (
    <Button
      style="rect"
      size="md"
      onClick={startCountDown}
      disabled={!rightHandPresent || counter != null}
      flexDirection="row"
      alignItems="center"
      borderRadius={4}
    >
      {rightHandPresent ? (
        counter == null ? (
          <Text>Press to start capture counterdown (5s)</Text>
        ) : (
          <Text>Capturing pose in {counter.toString()}s</Text>
        )
      ) : (
        <Text>No right hand found for capturing.</Text>
      )}
    </Button>
  );
}
