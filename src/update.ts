import { getStaticInputValues, setStaticValues, setStaticObjValues, setStaticInputValues } from "./components/static-inputs";
import { drawChartFunctions } from "./charts/draw-charts";
import { transformData } from "./functions";
import { defaultValues } from "./data";

const staticInputCollection = document.getElementsByClassName('static-input') as HTMLCollection;

var objValues = {...defaultValues}

function updateObj(dataObj: any){

  const staticObj = getStaticInputValues(staticInputCollection);

  staticObj['input-VFC-0'] = staticObj['input-VFC-1'];
  staticObj['input-tc1-0'] = staticObj['input-tc1-1'];
  staticObj['input-tc2-0'] = staticObj['input-tc2-1'];

  dataObj = setStaticValues(staticObj, dataObj);

  return dataObj;
}

// Function to draw the active panel
function drawActivePanel(resultObj: any){

  const panelNodes = document.querySelectorAll('.panel');

  // Use a for...of loop to iterate over elements
  for (const panel of panelNodes) {
    if (!panel.classList.contains('d-none')) {

      const prefixId = panel.id.replace('-panel', '');

      const func = drawChartFunctions[prefixId];
      if (func) {
        func(resultObj);
      }
    }
  }
}

// Function to attach change event listeners to inputs
function drawChartsOnInput(): void {
  const staticInputCollection = document.getElementsByClassName('static-input');

  for (let i = 0; i < staticInputCollection.length; i++) {
    const input = staticInputCollection[i];

    if (input instanceof HTMLInputElement) {
      input.addEventListener('change', async () => {
        try {
          objValues = updateObj(objValues);
          const resultObj = await transformData(objValues);
          drawActivePanel(resultObj);
        } catch (error) {
          console.error('Failed to process input change:', error);
        }
      });
    }
  }
}

function updateComponents(dataObj: any){

  // Update Static Inputs
  const staticObj = getStaticInputValues(staticInputCollection);

  const updatedStaticObj = setStaticObjValues(staticObj, dataObj);

  setStaticInputValues(staticInputCollection, updatedStaticObj);
}


export { updateObj, updateComponents, objValues, drawChartsOnInput, drawActivePanel }