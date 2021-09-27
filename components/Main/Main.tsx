import { observer } from "mobx-react-lite";
import { Box, Button, Text } from "grommet";
import { useRouter } from "next/router";
import {
    useSpring,
    a,
    AnimatedComponent,
    SpringValue,
    to,
} from "@react-spring/three";
import { useCallback, useMemo, useRef, FC, useEffect, useState } from "react";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function degToRad(deg: number) {
    return (deg * Math.PI) / 180;
}

/** This component creates a fullscreen colored plane */
function Background({ color }) {
    const { viewport } = useThree();
    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry attach="geometry" args={[1, 1]} />
            <a.meshBasicMaterial
                attach="material"
                color={color}
                depthTest={false}
            />
        </mesh>
    );
}

/** This component rotates a bunch of stars */
function Stars({ position }) {
    let group = useRef<typeof a.group>();
    let theta = 0;
    useFrame(() => {
        const r = 5 * Math.sin(degToRad((theta += 0.01)));
        const s = Math.cos(degToRad(theta * 2));
        //@ts-expect-error
        group.current.rotation.set(r, r, r);
        //@ts-expect-error
        group.current.scale.set(s, s, s);
    });
    const [geo, mat, coords] = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        const vertices = new Float32Array([
            -1.0, -1.0, 1.0, 1.0, -3.0, 1.0, 1.0, 1.0, 1.0,

            1.0, 1.0, 1.0, -1.0, 3.0, 1.0, -1.0, -1.0, 1.0,
        ]);

        // itemSize = 3 because there are 3 values (components) per vertex
        geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        // const geo = new THREE.SphereBufferGeometry(1, 10, 10);

        const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#29CCC4"),
        });

        const coords = new Array(1000)
            .fill(0)
            .map((i) => [
                Math.random() * 800 - 400,
                Math.random() * 800 - 400,
                Math.random() * 800 - 400,
            ]);
        return [geo, mat, coords];
    }, []);

    return (
        <a.group ref={group} position={position}>
            {coords.map(([p1, p2, p3], i) => (
                <mesh
                    key={i}
                    geometry={geo}
                    material={mat}
                    position={[p1, p2, p3]}
                />
            ))}
        </a.group>
    );
}

/** This component maintains the scene */
function Scene({
    top,
    mouse,
}: {
    top: SpringValue<number>;
    mouse: SpringValue<number[]>;
}) {
    const { size } = useThree();
    const scrollMax = size.height * 4.5;

    return (
        <>
            <a.spotLight
                intensity={1}
                color="white"
                position={mouse.to((x, y) => [x / 100, -y / 100, 6.5])}
            />
            <Background
                color={top.to(
                    [0, scrollMax * 0.25, scrollMax * 0.8, scrollMax],
                    ["#ffffff"]
                )}
            />
            <Stars position={top.to((top) => [0, -1 + top / 20, 0])} />
        </>
    );
}

export const Main = ({ children }: { children: JSX.Element }) => {
    const router = useRouter();
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }));

    return (
        <Box fill>
            <Box
                fill
                style={{ position: "absolute", bottom: "0", zIndex: 100 }}
            >
                <Box pad="large" align="start" direction="row" gap="large">
                    <Button
                        label={"zilmorphs"}
                        plain
                        style={{ fontSize: "2em", fontWeight: "bold" }}
                        onClick={() => router.push("/dapp")}
                    />

                    <Button
                        label={"get"}
                        plain
                        style={{ fontSize: "2em", fontWeight: "bold" }}
                        onClick={() => router.push("/dapp/get")}
                    />
                    <Button
                        label={"my morphs"}
                        plain
                        style={{ fontSize: "2em", fontWeight: "bold" }}
                        onClick={() => router.push("/dapp/my")}
                    />
                </Box>
                {children}
            </Box>
            <Canvas
                style={{
                    position: "absolute",
                    top: "0px",
                    pointerEvents: "none",
                }}
            >
                <Scene top={top} mouse={mouse} />
            </Canvas>
        </Box>
    );
};
