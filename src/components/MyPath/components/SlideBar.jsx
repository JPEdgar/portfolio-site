////// slider component reverse-engineered from:
// https://www.npmjs.com/package/react-input-range-slider

import React, { useContext } from "react";
import { GridContext, ACTIONS } from "../contexts/GridContext";

export default function SlideBar({ id, label, max }) {
  const [state, dispatch] = useContext(GridContext);
  const handleChange = (e) => {
    if (label === "Rows") {
      dispatch({ type: ACTIONS.GRID_ROWS_SET, payload: e.target.value });
    } else if (label === "Cols") {
      dispatch({ type: ACTIONS.GRID_COLS_SET, payload: e.target.value });
    }
  };

  let item;
  if (label === "Rows") {
    item = state.numRows;
  } else if (label === "Cols") {
    item = state.numCols;
  }

  return (
    <>
      <form>
        <input
          id={`slider${id}`}
          type="range"
          min={3}
          max={max}
          value={item}
          step={1}
          onChange={handleChange}
        />
        <label htmlFor={`slider${id}`}>
          {item} {label}
        </label>
      </form>
    </>
  );
}

// import styles from './styles.module.css'

/*
body {
  padding: 0;
  margin: 0;
}

.row {
  display: block;
  width: 90%;
  margin: 5%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #ccc;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  cursor: pointer;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #00adb5;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #00adb5;
  cursor: pointer;
}
*/

/*
 <>
{/ * <div className={styles.value} * /}
      <div
        // style={{
          // display: 'block',
          // textAlign: 'center',
          // marginTop: '5%',
          // color: '#00adb5'
        // }}
      >
{/ * {currentValue} * /}
      </div>
{/ * <div className={styles.row}> * /}
      <div >
        <input
          type='range'
          // className={styles.slider}
          styles={{

          }}
          min={min}
          max={max}
          value={currentValue}
          step={step}
          onChange={onChange}
        />
      </div>
    </>
*/
