
function getStaticInputValues(staticInputCollection: HTMLCollection){
    const inputValues: any = {};
    
    for(let input of staticInputCollection){
      // Ensure the element is an HTMLInputElement
      if (input instanceof HTMLInputElement) {
  
        const inputIdString: string = input.id
  
        if (input.classList.contains('percent')) {
          // round to 2 decimals
          inputValues[inputIdString] = Math.round(Number(input.value) * 100) / 10000;
        } else if (input.classList.contains('negative')){
          inputValues[inputIdString] = -1 * Number(input.value);
        } else if (input.classList.contains('year')){
          inputValues[inputIdString] = Number(input.value) - 2024;
        } else {
          inputValues[inputIdString] = Number(input.value);
        }
      }
    }
    return inputValues
  }
  
  function setStaticValues(staticObj: any, dataObj: any) {
    let result = {...dataObj};
    for (let key in staticObj) {
      // split dash-separated keys from staticObj
      let keys = key.replace('input-', '').split('-');
      // find the depth of the array
      let lastKeyIndex = keys.length - 1;
      // initialize currentObj with all the result props
      let currentObj = result;
      keys.forEach((keyPart, index) => {
        // if last key, assign value from static
        if (index === lastKeyIndex) {
          currentObj[keyPart] = staticObj[key];
        } else {
          // if prop doesn't exist, create an empty array
          if (!currentObj[keyPart]) {
            currentObj[keyPart] = [];
          }
          // if is not the last prop, currentObj is the prop of the next level
          currentObj = currentObj[keyPart];
        }
      });
    }
    return result;
  }
  
  function setStaticObjValues(staticObj: any, dataObj: any) {
    let result = {...staticObj};
    for (let key in result) {
      let keys = key.replace('input-', '').split('-');
      let lastKeyIndex = keys.length - 1;
      let currentObj = dataObj;
      keys.forEach((keyPart, index) => {
        if (index === lastKeyIndex) {
          result[key] = currentObj[keyPart];
        } 
        else {
          currentObj = currentObj[keyPart];
        }
      });
    }
    return result;
  }
  
  function setStaticInputValues(staticInputCollection: HTMLCollection, staticObj: any): void{
    for (let input of staticInputCollection){
      if (input instanceof HTMLInputElement) {
        const inputIdString = input.id
        if (Object.keys(staticObj).includes(inputIdString)){
          if (input.classList.contains('percent')) {
            input.value = (staticObj[inputIdString] * 100).toString();
          } else if (input.classList.contains('negative')){
            staticObj[inputIdString] = (-1 * Number(input.value)).toString();
          } else if (input.classList.contains('year')){
            staticObj[inputIdString] = (Number(input.value) + 2024).toString();
          } else {
            input.value = (staticObj[inputIdString]).toString();
          }
        }
      }
    }
  }
  
  export { setStaticValues, getStaticInputValues, setStaticObjValues, setStaticInputValues }