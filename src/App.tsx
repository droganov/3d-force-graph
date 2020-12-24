// @ts-nocheck
import React, { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import "./App.css";

import graph from "./graph.json";

const { dataLinks, dataNodes } = graph.data.networkData;

const links = dataLinks.map(({ source, target, typeLink }) => ({
  source,
  target,
  typeLink,
}));
const nodes = dataNodes.map(
  ({ id, screenName: name, degree, profilePhoto, text }) => ({
    id,
    name,
    profilePhoto,
    text,
    val: degree * 10,
  })
);

const nodeSize = 8;
const unknownPic = "./avatar.png";
const alphaPic = "./alpha.png";

function linkColor({ typeLink }) {
  switch (typeLink) {
    case "retweet":
      return 0x03f4ff;
    case "mention":
      return 0x00a9c0;
    case "quote":
      return 0x6066ff;
    case "reply":
      return 0x753bd2;
    case "source":
      return 0xadb4c8;
    default:
      return 0x000;
  }
}

function App() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const graph = ForceGraph3D()(ref.current)
        .graphData({ links, nodes })
        .backgroundColor("#fff")
        .linkColor(() => "#717171")
        .linkOpacity(0.08)
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth(1)
        .linkDirectionalParticleColor(linkColor)
        .nodeLabel((node) => {
          console.log("node: ", node);
          return `
            <div class="baloon">
              <h6>${node.id}</h6>
              <small>${node.text.join("<br/>")}</small>
            </div>
          `;
        })
        .onNodeRightClick((node) => {
          // Aim at node from outside it
          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

          graph.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: node.z * distRatio,
            }, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
          );
        })
        .nodeRelSize(nodeSize)
        .nodeThreeObject((threeObj) => {
          const { profilePhoto } = threeObj as { profilePhoto: string };
          const alphaMap = new THREE.TextureLoader().load(alphaPic);
          const imgTexture = new THREE.TextureLoader().load(
            profilePhoto ? `./twitter/${threeObj.id}.jpg` : unknownPic
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
        });
      // return () => {
      //   ref.current?.removeChild(ref.current.lastChild);
      // };
    }
  });
  return <div ref={ref} />;
}

export default App;
