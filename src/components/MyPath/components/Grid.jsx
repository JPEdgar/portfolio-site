import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { GridContext, ACTIONS } from "../contexts/GridContext";
import SlideBar from "../components/SlideBar";
import BuildGrid from "../components/BuildGrid";
import FindNeighbor from "../algorithms/FindNeighbor";

export default function Grid() {
  const [state, dispatch] = useContext(GridContext);
  const [grid, setGrid] = useState(BuildGrid(state));
  const [startSearchedAnimation, setStartSearchedAnimation] = useState(false);
  const [searchedNodes, setSearchedNodes] = useState([]);
  const [luckyNode, setLuckyNode] = useState([]); // the node that found the end.
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [startAnim, setStartAnim] = useState(false);
  const animDelay = 50;
  let searchNode = [];
  let isSearching = false;
  let searchArray = [];

  // temp start
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount((curr) => curr + 1);
  }, []);
  // temp end

  useEffect(() => {
    console.log("numrows, numcols, startpos, end pos changed");
    setGrid(BuildGrid(state));
    // eslint-disable-next-line
  }, [state.numRows, state.numCols, state.startPos, state.endPos]);

  useEffect(() => {
    console.log(
      `startSearchAnimation changed.  Now = ${startSearchedAnimation}`
    );
    if (startSearchedAnimation) {
      AnimateSearchedNodes();
    } // eslint-disable-next-line
  }, [startSearchedAnimation]);

  function AnimateSearchedNodes() {
    console.log("in AnimateSearchedNodes function");
    const tempSearched = [...searchedNodes];
    let count = 0;
    const interval = setInterval(() => {
      if (count < searchedNodes.length) {
        const activeNode = tempSearched.shift();
        const element = document.getElementById(
          `${activeNode[0]}, ${activeNode[1]}`
        );
        const shorthand = ReactDOM.findDOMNode(element).classList;
        shorthand.add("visitedNode");
      } else {
        setStartAnim(true);
        clearInterval(interval);
      }
      count++;
    }, animDelay);
    return () => clearInterval(interval);
  }

  useEffect(() => {
    console.log(`startAnim changed.  Now = ${startAnim}`);
    if (startAnim) {
      const path = FindPath(); // returns list of children array
      console.log(path.length);

      setTimeout(() => {
        AnimatePath(path);
      }, animDelay);
    } // eslint-disable-next-line
  }, [startAnim]);

  function FindPath() {
    console.log("in FindPath function");
    const listOfChildren = [`${luckyNode[0]}, ${luckyNode[1]}`];
    let search = true;
    const start = state.startPos[0] + ", " + state.startPos[1];
    // while (search) {
    let i = 0;
    while (i < 10 && search) {
      i++;
      let parent = listOfChildren.slice(-1);
      // eslint-disable-next-line
      if (parent[0] == start) {
        search = false;
      } else {
        const element = document.getElementById(parent);
        if (element) {
          listOfChildren.push(element.getAttribute("parent-node"));
        }
      }
    }

    return listOfChildren;
  }

  function AnimatePath(listOfChildren) {
    console.log("in AnimatePath function.  Props = ");
    console.log(listOfChildren);
    let i = listOfChildren.length;
    const start = state.startPos[0] + ", " + state.startPos[1];
    const interval = setInterval(() => {
      if (i > 0) {
        i--;
        let path = listOfChildren.pop();
        // eslint-disable-next-line
        if (path != start) {
          const element = document.getElementById(path);
          console.log("building path node");
          console.log(element);
          // const shorthand = ReactDOM.findDOMNode(element).classList;
          // shorthand.add("pathNode");
        }
      }
    }, animDelay);
    return () => clearInterval(interval);
  }

  function handleClick(e) {
    const clickLocation = [
      parseInt(e.target.getAttribute("x-loc")),
      parseInt(e.target.getAttribute("y-loc")),
    ];

    if (start) {
      dispatch({ type: ACTIONS.SET_START, payload: clickLocation });
      setStart(false);
    } else if (end) {
      dispatch({ type: ACTIONS.SET_END, payload: clickLocation });
      setEnd(false);
    } else {
      // console.log(e.target.id); // string "#, #"
      // console.log(clickLocation); // array [number, number]
      console.log(e.target);
    }
  }

  function SearchForNeighbors() {
    do {
      GetNeighbor();
    } while (isSearching);
  }
  function GetNeighbor() {
    let locatedEnd = false;

    if (searchArray.length <= 0 && !isSearching) {
      searchNode = [...state.startPos];
      isSearching = true;
    } else if (searchArray.length > 0) {
      searchNode = searchArray.shift();
    } else {
      isSearching = false;
    }

    // console.log(`searchNode = ${searchNode}`)
    if (searchNode.length > 0) {
      const [
        searchResults,
        continueSearch,
        foundEnd,
        returnLuckyNode,
      ] = FindNeighbor(searchNode, state); // return [returnArr (arr), continueSearch (bool), foundEnd (bool), luckyNode (arr)];
      locatedEnd = foundEnd;
      setLuckyNode(returnLuckyNode);

      if (continueSearch) {
        searchArray = searchArray.concat(searchResults);
        setSearchedNodes((curr) => curr.concat(searchResults));
      } else {
        searchArray = searchResults;
        setSearchedNodes((curr) => curr.concat(searchResults));
      }
    }

    if (locatedEnd) {
      setStartSearchedAnimation(true);
    }
    // console.log(searchArray)
  }
  console.log("- - - -")

  return (
    <>
      <h3>Grid Render Count = {renderCount}</h3>
      <section style={{ display: "flex" }}>
        <div>
          <SlideBar
            id={1}
            label="Rows"
            max={30}
            value={state.numRows}
            callback={state.numRows}
          />
          <SlideBar
            id={2}
            label="Cols"
            max={30}
            value={state.numCols}
            callback={state.numCols}
          />
        </div>

        <button
          style={{
            height: "40px",
            width: "100px",
            marginLeft: "10px",
            backgroundColor: start ? "cyan" : "",
          }}
          onClick={() => setStart(!start)}
        >
          Set Start
        </button>

        <button
          style={{
            height: "40px",
            width: "100px",
            marginLeft: "10px",
            backgroundColor: end ? "cornsilk" : "",
          }}
          onClick={() => setEnd(!end)}
        >
          Set End
        </button>

        <button
          onClick={() => SearchForNeighbors()}
          style={{ height: "40px", width: "100px", marginLeft: "10px" }}
        >
          Get Path
        </button>
      </section>
      <br />

      <div
        onClick={(e) => handleClick(e)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {grid.map((rows) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "40px",
              }}
            >
              {rows.map((cell) => {
                return <>{cell}</>;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}