
function displayRangeValue(){

    const staticInputCollection = document.getElementsByClassName('static-input') as HTMLCollection;
  
    for(let input of staticInputCollection){
      
      if (input instanceof HTMLInputElement) {
  
        if (input.type == "range"){
        
          const displayId = `per_${input.id}`;
  
          const displaySpan = document.getElementById(displayId) as HTMLElement;
    
          input.addEventListener("input", () => {
  
            displaySpan.innerText = input.value;
            
          })
        }
      }
    }
  }
  
  export { displayRangeValue }