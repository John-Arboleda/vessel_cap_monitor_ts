// import { transformData } from "./functions";
// import { defaultValues } from "./data";
import { navbarResultsScroll } from "./components/navbar-results";
import { createNavEvents} from "./components/main-navbar";
import { runFleetVesselsCharts } from "./charts/draw-charts";
import { displayRangeValue } from "./components/range-value";
import { validatePayPer } from "./components/validations";

import { drawChartsOnInput, updateObj } from "./update"; 

import { createRegionInputs } from "./components/regions-input";
import { createVesselInputs } from "./components/vessel-input";
import { createRetrofitInputs } from "./components/retrofit-input";
import { userParams } from "./logic/parameters";
// import { updateObj } from "./update";
import { transformData } from "./logic/functions";
import { getDevParams } from "./logic/parameters";

createRegionInputs();
createVesselInputs();
createRetrofitInputs();
displayRangeValue();
drawChartsOnInput();
validatePayPer();

(async () => {
  const devParams = await getDevParams()
  console.log(devParams);

  const objData = updateObj(userParams);
  console.log(objData);
  const resultObj = await transformData(objData);
  // console.log(resultObj);
  
  runFleetVesselsCharts(resultObj);
})();
createNavEvents();
navbarResultsScroll();

window.addEventListener("load", () => {
  // console.log("Page fully loaded.");
  // const resultObj = transformData(defaultValues);
  
  // createNavEvents();
  // navbarResultsScroll();
  // await runAnalysisCharts(resultObj);
  // console.log(resultObj);
})