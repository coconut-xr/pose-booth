import { useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { BackSide, DoubleSide } from "three";

export default function Background({ ...props }: GroupProps) {

    const dayUrl = "environment/city_day.jpg"
    const nightUrl = "environment/city_night.jpg"

    const textureProps = useTexture({
        map: dayUrl,
      })

    return (
        <group>
            <mesh position={[0,10,0]}>
                <sphereGeometry args={[100, 32]}/>
                <meshStandardMaterial {...textureProps} side={BackSide} />
            </mesh>
        </group>
    )
}

