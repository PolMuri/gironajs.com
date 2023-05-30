/*
Base Auto-generated by: https://github.com/pmndrs/gltfjsx and then edited to rock!
Command: npx gltfjsx@6.1.4 dragon.glb --transform
*/

import * as THREE from 'three';
import { Group } from 'three';
import React, { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Dragon: THREE.SkinnedMesh;
    spine: THREE.Bone;
    spine007: THREE.Bone;
  };
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial;
  };
};

declare type DragonProps = JSX.IntrinsicElements['group'] & {
  centerPosition: [number, number, number];
  radius?: number;
  speedMultiplier?: number;
  offsetInitialPosition?: number;
  color?: string;
};

export function Dragon({
  centerPosition,
  radius = 1,
  speedMultiplier = 1,
  offsetInitialPosition = 1,
  color = '#3b2d2d',
  ...props
}: DragonProps) {
  // - REFS
  // Three React Fiber invites to use useRef(null!) as the official way to useRef three react fiber components -> https://docs.pmnd.rs/react-three-fiber/tutorials/typescript#typing-with-useref
  // The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root: React.MutableRefObject<Group> = useRef(null!);

  // -- MODELS && ANIMATIONS
  const { nodes, animations } = useGLTF(
    '/assets/3d/models/dragon.glb'
  ) as GLTFResult;
  const { ref, mixer, clips } = useAnimations(animations, root);

  // -- EFFECTS
  useEffect(() => {
    //All animations are in single animation keyframe, we finetune the two animations and play them TOGETHER for more realist animation
    const clip = clips[0];
    const flyClip = THREE.AnimationUtils.subclip(clip, 'fly', 0, 14);
    const idleClip = THREE.AnimationUtils.subclip(clip, 'idle', 14, 75);

    //Bug with three react fiber where mixer does not have _root element and because of that, we need to pass it explicitly
    if (ref.current) {
      const flyAction = mixer.clipAction(flyClip, ref.current);
      flyAction.timeScale = 0.5; //speed animation multiplier
      const idleAction = mixer.clipAction(idleClip, ref.current);
      idleAction.timeScale = 1;
      idleAction.loop = THREE.LoopPingPong;

      flyAction.play();
      idleAction.play();
    }
  }, [clips, mixer, ref]);

  // -- FRAME / ANIMATIONS
  useFrame((state) => {
    const mesh = root.current;

    //position
    const elapsedTime = state.clock.getElapsedTime();
    mesh.position.x =
      centerPosition[0] +
      Math.cos(elapsedTime * speedMultiplier + offsetInitialPosition) * radius;
    mesh.position.z =
      centerPosition[2] +
      Math.sin(elapsedTime * speedMultiplier + offsetInitialPosition) * radius;

    //NOTE: the 0.01 is the offset to generate a vector in front of his eyes
    const lookAt = new THREE.Vector3(
      centerPosition[0] +
        Math.cos(elapsedTime * speedMultiplier + offsetInitialPosition + 0.01) *
          radius,
      centerPosition[1],
      centerPosition[2] +
        Math.sin(elapsedTime * speedMultiplier + offsetInitialPosition + 0.01) *
          radius
    );

    mesh.lookAt(lookAt);

    //rotation
    // root.current.rotation.y += -1 * delta * radius;
  });

  return (
    <group ref={root} position={centerPosition} {...props} dispose={null}>
      <group name="Scene">
        <group name="metarig">
          <primitive object={nodes.spine} />
          <primitive object={nodes.spine007} />
          <skinnedMesh
            name="Dragon"
            geometry={nodes.Dragon.geometry}
            skeleton={nodes.Dragon.skeleton}
          >
            <meshStandardMaterial color={color} />
          </skinnedMesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/assets/3d/models/dragon.glb');