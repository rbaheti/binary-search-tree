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
    this.state = {
      myGraph: {
        nodes: {},
      },
    };
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.keydownHandler, false);
    this.generateDefaultGraph();
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.keydownHandler, false);
  };

  deleteSubtreeRecursively = (myGraph, id) => {
    let node = myGraph.nodes[id];

    if (node.left !== null) {
      this.deleteSubtreeRecursively(myGraph, node.left);
    }
    if (node.right !== null) {
      this.deleteSubtreeRecursively(myGraph, node.right);
    }

    if (node.parentId !== null) {
      let parentNode = myGraph.nodes[node.parentId];
      if (node.num <= parentNode.num) {
        parentNode.left = null;
      } else {
        parentNode.right = null;
      }
    }
    delete myGraph.nodes[id];
  };

  onClickNodeFunc = (e) => {
    const id = e.data.node.id;
    console.log("Clicked ", id);
    this.setState((previousState) => {
      let myGraph = previousState.myGraph;
      this.deleteSubtreeRecursively(myGraph, id);
      if (Object.values(myGraph.nodes).length === 0) {
        delete myGraph.rootId;
      }
      return { myGraph };
    });
  };

  addVertex = (myGraph, num, parentId) => {
    const id = uuidv4();
    const label = num + "";

    let node = { id, label, num, left: null, right: null };
    if (Object.values(myGraph.nodes).length === 0) {
      node.parentNum = null;
      node.parentId = null;
      node.level = 0;
      node.y = node.level;

      console.log("setting rootId: ", id);
      myGraph.rootId = id;
    } else {
      let parentNode = myGraph.nodes[parentId];
      node.parentNum = parentNode.num;
      node.parentId = parentId;
      node.level = parentNode.level + 1;
      node.y = node.level;

      if (num <= parentNode.num) {
        parentNode.left = id;
      } else {
        parentNode.right = id;
      }
    }
    myGraph.nodes[id] = node;
  };

  addEdge = (myGraph, id, source, target, label) => {
    myGraph.edges.push({ id, source, target, label });
  };

  addValue = (num) => {
    this.setState((previousState) => {
      let myGraph = previousState.myGraph;
      if (Object.values(myGraph.nodes).length === 0) {
        this.addVertex(myGraph, num, null);
        return { myGraph };
      }

      let parentId = myGraph.rootId;
      while (true) {
        let parentNode = myGraph.nodes[parentId];
        console.log("num: ", num, " parent num: ", parentNode.num);
        if (num <= parentNode.num) {
          if (parentNode.left === null) {
            this.addVertex(myGraph, num, parentId);
            break;
          } else {
            parentId = parentNode.left;
          }
        } else {
          if (parentNode.right === null) {
            this.addVertex(myGraph, num, parentId);
            break;
          } else {
            parentId = parentNode.right;
          }
        }
      }
      this.assignCoordinates(myGraph);
      return { myGraph };
    });
  };

  generateDefaultGraph = () => {
    this.addValue(4);
    this.addValue(2);
    this.addValue(1);
    this.addValue(3);
    this.addValue(3);
    this.addValue(6);
    this.addValue(5);
    this.addValue(7);
    this.addValue(8);
    this.addValue(9);
    this.addValue(0);
  };

  assignCoordinates = (myGraph) => {
    let nodes = Object.values(myGraph.nodes);
    nodes.sort(function (node1, node2) {
      if (node1.num !== node2.num) {
        return node1.num - node2.num;
      }
      // Because left branch contains <=, and left node should always be on the
      // left of the root node.
      return node2.level - node1.level;
    });

    for (let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];
      node.x = i + 1;
    }
  };

  populateEdges = (myGraph) => {
    myGraph.edges = [];
    Object.values(myGraph.nodes).forEach((node) => {
      if (node.left !== null) {
        this.addEdge(myGraph, "edge-" + node.id + "-" + node.left, node.id, node.left, "left");
      }
      if (node.right !== null) {
        this.addEdge(myGraph, "edge-" + node.id + "-" + node.right, node.id, node.right, "right");
      }
    });
  };

  keydownHandler = (event) => {
    if (event.code === "Space") {
      const num = Math.floor(Math.random() * 201) - 100;
      console.log("generated ", num);
      this.addValue(num);
    }
  };

  render = () => {
    console.log("this.state: ", this.state);
    let myGraph = {};
    myGraph["nodes"] = Object.values(this.state.myGraph.nodes);
    this.populateEdges(myGraph);
    const drawEdgeLabels = myGraph["nodes"].length < 20;
    console.log("myGraph: ", myGraph);
    return (
      <div style={{ width: "90%", margin: "auto", padding: "20px" }}>
        <Sigma
          graph={myGraph}
          key={myGraph.nodes.length + "hey"}
          settings={{
            drawEdges: true,
            drawLabels: true,
            drawEdgeLabels,
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
