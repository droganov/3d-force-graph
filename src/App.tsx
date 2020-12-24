// @ts-nocheck
import React, { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
// import "./App.css";

import graph from "./graph.json";

const { dataLinks, dataNodes } = graph.data.networkData;

const links = dataLinks.map(({ source, target }) => ({
  source,
  target,
}));
const nodes = dataNodes.map(
  ({ id, screenName: name, degree: val, profilePhoto }) => ({
    id,
    name,
    profilePhoto,
    val,
  })
);

const nodeSize = 8;
const unknownPic = "./avatar.png";
const alphaPic = "./alpha.png";

function App() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ForceGraph3D()(ref.current)
        .graphData({ links, nodes })
        .backgroundColor("#fff")
        .linkColor(() => "#717171")
        .linkOpacity(0.08)
        .nodeRelSize(nodeSize)
        .nodeThreeObject((threeObj) => {
          const { profilePhoto } = threeObj as { profilePhoto: string };
          const alphaMap = new THREE.TextureLoader().load(alphaPic);
          const imgTexture = new THREE.TextureLoader().load(
            profilePhoto || unknownPic
          );
          const material = new THREE.SpriteMaterial({
            alphaMap,
            map: imgTexture,
            // color: profilePhoto ? undefined : 0x000000,
            // transparent: false,
          });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(nodeSize, nodeSize, nodeSize);
          return sprite;
        })
        .nodeAutoColorBy("user");
    }
  });
  return <div ref={ref} />;
}

export default App;
