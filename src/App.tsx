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
      const Graph = ForceGraph3D()(ref.current)
        .graphData({ links, nodes })
        .backgroundColor("#fff")
        .linkColor(() => "#717171")
        // .linkCurvature(0.24)
        // .linkMaterial(
        //   new THREE.LineBasicMaterial({
        //     blendDstAlpha: 0,
        //     color: 0x000000,
        //     linewidth: 1,
        //     linecap: "round", //ignored by WebGLRenderer
        //     linejoin: "round", //ignored by WebGLRenderer
        //   })
        // )
        .linkOpacity(0.08)
        // .linkWidth(1)
        // .linkThreeObject((link) => {
        //   const material = new THREE.LineBasicMaterial({
        //     color: 0x000000,
        //     linewidth: 1,
        //     linecap: "round", //ignored by WebGLRenderer
        //     linejoin: "round", //ignored by WebGLRenderer
        //   });
        //   const geometry = new THREE.BufferGeometry();
        //   geometry.setAttribute(
        //     "position",
        //     new THREE.BufferAttribute(new Float32Array(2 * 3), 3)
        //   );
        //   // geometry.setAttribute("color", new THREE.BufferAttribute([], 3));

        //   return new THREE.Line(geometry, material);
        // })
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
      // .nodeLabel((node) => `${node.user}: ${node.description}`)
      // .onNodeHover((node) => (elem.style.cursor = node ? "pointer" : null))
      // .onNodeClick((node) =>
      //   window.open(`https://bl.ocks.org/${node.user}/${node.id}`, "_blank")
      // );
    }
  });
  return <div ref={ref}>test</div>;
}

export default App;
