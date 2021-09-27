//@ts-nocheck
import { observer } from "mobx-react-lite";
import { Box, Button } from "grommet";
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
import images from "../data";

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

/** This component loads an image and projects it onto a plane */
function Image({ url, opacity, scale, ...props }) {
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
    const [hovered, setHover] = useState(false);
    const hover = useCallback(() => setHover(true), []);
    const unhover = useCallback(() => setHover(false), []);
    const { factor } = useSpring({ factor: hovered ? 1.1 : 1 });
    return (
        <a.mesh
            {...props}
            //@ts-expect-error
            onHover={hover}
            onUnhover={unhover}
            scale={factor.interpolate((f) => [scale * f, scale * f, 1])}
        >
            <planeBufferGeometry attach="geometry" args={[5, 5]} />
            <a.meshLambertMaterial
                attach="material"
                transparent
                opacity={opacity}
            >
                <primitive attach="map" object={texture} />
            </a.meshLambertMaterial>
        </a.mesh>
    );
}

/** This component creates a bunch of parallaxed images */
function Images({ top, mouse, scrollMax }) {
    return images.map(([url, x, y, factor, z, scale], index) => (
        <Image
            key={index}
            url={url}
            scale={scale}
            opacity={top.to([0, 500], [0.5, 1])}
            position={to([top, mouse], (top, mouse) => [
                (-mouse[0] * factor) / 50000 + x,
                (mouse[1] * factor) / 50000 +
                    y * 1 +
                    ((top * factor) / scrollMax) * 2,
                z + top / 2000,
            ])}
        />
    ));
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
                intensity={1.3}
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
            {/* @ts-expect-error */}
            <Images top={top} mouse={mouse} scrollMax={scrollMax} />
            <Text
                opacity={top.to([0, 200], [1, 0])}
                position={top.to((top) => [0, -1 + top / 200, 0])}
            >
                zilmorphs
            </Text>
            {/* @ts-expect-error */}
            <Text
                position={top.to((top) => [
                    0,
                    -20 + ((top * 10) / scrollMax) * 2.11,
                    0,
                ])}
                fontSize={50}
            >
                Zilliqa bridge
            </Text>
            {/* @ts-expect-error */}
            <Text
                position={top.to((top) => [
                    0,
                    -20 + ((top * 10) / scrollMax) * 2.04,
                    0,
                ])}
                fontSize={50}
            >
                created a disturbance
            </Text>
            {/* @ts-expect-error */}
            <Text
                position={top.to((top) => [
                    0,
                    -20 + ((top * 10) / scrollMax) * 1.97,
                    0,
                ])}
                fontSize={50}
            >
                the unispheres have collided
            </Text>
            {/* @ts-expect-error */}
            <Text
                position={top.to((top) => [
                    0,
                    -20 + ((top * 10) / scrollMax) * 1.9,
                    0,
                ])}
                fontSize={50}
            >
                8000 zilmorphs have arrived
            </Text>
        </>
    );
}

/** This renders text via canvas and projects it as a sprite */
function Text({
    children,
    position,
    opacity,
    color = "black",
    fontSize = 410,
    bold = "bold",
}) {
    const {
        size: { width, height },
        viewport: { width: viewportWidth, height: viewportHeight },
    } = useThree();
    const [text, setText] = useState(children);
    const scale =
        viewportWidth > viewportHeight ? viewportWidth : viewportHeight;
    const canvas = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 2048;
        const context = canvas.getContext("2d");
        context.font = `${bold} ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = color;
        context.fillText(text, 1024, 1024 - 410 / 2);
        return canvas;
    }, [text, width, height]);

    return (
        <a.sprite
            scale={[scale, scale, 1]}
            position={position}
            onClick={() => console.log("asfe")}
        >
            <a.spriteMaterial attach="material" transparent opacity={opacity}>
                <canvasTexture
                    onClick={() => {
                        console.log("asef");
                    }}
                    attach="map"
                    image={canvas}
                    premultiplyAlpha
                    //@ts-expect-error
                    onUpdate={(s) => (s.needsUpdate = true)}
                />
            </a.spriteMaterial>
        </a.sprite>
    );
}

export default observer(() => {
    const router = useRouter();
    // This tiny spring right here controlls all(!) the animations, one for scroll, the other for mouse movement ...
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }));
    const onMouseMove = useCallback(
        ({ clientX: x, clientY: y }) =>
            set({
                mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2],
            }),
        []
    );
    const onScroll = useCallback((e) => set({ top: e.target.scrollTop }), []);

    return (
        <Box fill>
            <Box
                style={{ position: "absolute", bottom: "0", zIndex: 100 }}
                pad="xlarge"
                fill="horizontal"
                align="center"
            >
                <Button
                    label={"Go to dapp"}
                    onClick={() => router.push("/dapp")}
                />
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
            <div
                style={{
                    position: "absolute",
                    overflow: "auto",
                    top: "0px",
                    width: "100%",
                    height: "100vh",
                    fontSize: "20em",
                    fontWeight: 800,
                    lineHeight: "0.9em",
                }}
                onScroll={onScroll}
                onMouseMove={onMouseMove}
            >
                <div style={{ height: "525vh" }} />
            </div>
        </Box>
    );
});
