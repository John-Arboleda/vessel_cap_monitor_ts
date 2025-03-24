import { transformData } from "./functions";
import { defaultValues } from "./data";
import { navbarResultsScroll } from "./components/navbar-results";
import { createNavEvents} from "./components/main-navbar";
import { runEmissionCharts } from "./charts/draw-charts";
import { displayRangeValue } from "./components/range-value";
import { validatePayPer } from "./components/validations";

import { drawChartsOnInput } from "./update"; 

import { createRegionInputs } from "./components/regions-input";
import { createVesselInputs } from "./components/vessel-input";
// var objValues = {...defaultValues}

// console.log(updateObj(objValues));
createRegionInputs();
createVesselInputs();
displayRangeValue();
drawChartsOnInput();
validatePayPer();


// console.log(resultObj);

// console.log(createFleetByTech(resultObj.N));

// (() => {
//   console.log("Page fully loaded.");
// })();

(async () => {
  const resultObj = await transformData(defaultValues);

  runEmissionCharts(resultObj);
})();
createNavEvents();
navbarResultsScroll();

window.addEventListener("load", () => {
  // console.log("Page fully loaded.");
  // const resultObj = transformData(defaultValues);
  
  // createNavEvents();
  // navbarResultsScroll();
  // await runAnalysisCharts(resultObj);
  //console.log(resultObj);
})