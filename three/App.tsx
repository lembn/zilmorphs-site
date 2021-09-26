import * as THREE from "three";
import { useState, useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import {
    /*Reflector, */ CameraShake,
    OrbitControls,
    useTexture,
} from "@react-three/drei";
import { KernelSize } from "postprocessing";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SVGLoader } from "./SVGLoader";
// current @react-three/drei's Reflector is messed up atm, needs a revert
import { Reflector } from "./Reflector";

function Triangle({ color, ...props }) {
    const ref = useRef<{ position: { y: number } }>();
    const [r] = useState(() => Math.random() * 10000);
    useFrame(
        (_) =>
            (ref.current.position.y =
                -1.75 + Math.sin(_.clock.elapsedTime + r) / 10)
    );
    const { paths: [path] } = useLoader(SVGLoader, '/crown.svg') // prettier-ignore
    const geom = useMemo(
        () =>
            //@ts-ignore
            SVGLoader.pointsToStroke(
                path.subPaths[0].getPoints(),
                path.userData.style
            ),
        []
    );
    return (
        <group ref={ref}>
            <mesh geometry={geom} {...props}>
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
        </group>
    );
}

function Rig({ children }) {
    const ref = useRef<{
        position: { y: number; lerp: (D: THREE.Vector3, n: number) => void };
        rotation: { y: number };
    }>();
    const vec = new THREE.Vector3();
    const { camera, mouse } = useThree();
    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 2, 0, 3.5), 0.05);
        ref.current.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.1, 0), 0.1);
        ref.current.rotation.y = THREE.MathUtils.lerp(
            ref.current.rotation.y,
            (-mouse.x * Math.PI) / 20,
            0.1
        );
    });
    return <group ref={ref}>{children}</group>;
}

function Ground(props) {
    const [floor, normal] = useTexture([
        "/SurfaceImperfections003_1K_var1.jpg",
        "/SurfaceImperfections003_1K_Normal.jpg",
    ]);
    return (
        <Reflector resolution={1024} args={[8, 8]} {...props}>
            {(Material, props) => (
                <Material
                    color="#f0f0f0"
                    metalness={0}
                    roughnessMap={floor}
                    normalMap={normal}
                    //@ts-expect-error
                    normalScale={[0.6, 0.6]}
                    {...props}
                />
            )}
        </Reflector>
    );
}

export function Triangles() {
    return (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15] }}>
            <color attach="background" args={["black"]} />
            <ambientLight />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
            />
            <Suspense fallback={null}>
                <Rig>
                    <Triangle
                        color="#ff2060"
                        scale={0.009}
                        position={[0, 4.5, -2]}
                        rotation={[0, 0, Math.PI]}
                    />
                    <Triangle
                        color="cyan"
                        scale={0.009}
                        position={[-3, 4.5, -5]}
                        rotation={[0, 0, Math.PI]}
                    />
                    <Triangle
                        color="orange"
                        scale={0.009}
                        position={[3, 4.5, -4]}
                        rotation={[0, 0, Math.PI]}
                    />
                    <Triangle
                        color="white"
                        scale={0.009}
                        position={[0, 4.5, -10]}
                        rotation={[0, 0, Math.PI]}
                    />
                    <Ground
                        mirror={1}
                        mixBlur={10}
                        mixStrength={1}
                        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                        blur={[300, 120]}
                        position-y={-0.8}
                    />
                </Rig>
                <EffectComposer multisampling={8}>
                    <Bloom
                        kernelSize={3}
                        luminanceThreshold={0}
                        luminanceSmoothing={0.4}
                        intensity={0.6}
                    />
                    <Bloom
                        kernelSize={KernelSize.HUGE}
                        luminanceThreshold={0}
                        luminanceSmoothing={0}
                        intensity={0.5}
                    />
                </EffectComposer>
            </Suspense>
            <CameraShake
                yawFrequency={0.2}
                pitchFrequency={0.2}
                rollFrequency={0.2}
            />
        </Canvas>
    );
}
