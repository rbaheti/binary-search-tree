import React, { Component } from "react";
import {
  onClickNode,
  onClickEdge,
  EdgeShapes,
  NodeShapes,
  Sigma,
  RandomizeNodePositions,
  RelativeSize,
} from "react-sigma";
import { v4 as uuidv4 } from "uuid";

export default class BinaryTree extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let myGraph = {
      nodes: [
        { id: "n1", label: "Alice" },
        { id: "n2", label: "Rabbit" },
      ],
      edges: [{ id: "e1", source: "n1", target: "n2", label: "SEES" }],
    };
    return (
      <div>
        <Sigma
          graph={myGraph}
          key={myGraph.nodes.length + "hey"}
          settings={{
            drawEdges: true,
            drawLabels: true,
            drawEdgeLabels: true,
            clone: false,
            defaultNodeColor: "#FF530D",
            defaultEdgeColor: "#FFB87C",
            minNodeSize: 8,
            maxNodeSize: 15,
            defaultLabelSize: 15,
          }}
          renderer="canvas"
          style={{ maxWidth: "inherit", height: "600px" }}
          onClickNode={this.onClickNodeFunc}
        >
          <RelativeSize initialSize={15} />
        </Sigma>
      </div>
    );
  };
}
