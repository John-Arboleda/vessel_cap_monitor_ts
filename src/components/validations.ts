
function validatePayPer(){

    const elementsToValidate: string[] = ['lambda', 'LO'];
  
    elementsToValidate.forEach(elementName => {
  
      const elementCollection = document.getElementsByClassName(elementName) as HTMLCollection;
  
      validateHundredPer(elementCollection, elementName);
    });
  }
  
  function validateHundredPer(elementCollection: HTMLCollection, elementName: string){
    
    let numberSpam = document.getElementById(elementName + '-spam') as HTMLElement;
    
    for (let input of elementCollection){
      input.addEventListener('change',() => {
        const elementValidationMessage = document.getElementById(elementName + '-alert') as HTMLElement;
        if(sumPayPerValue(elementCollection) != 1.00){
          elementValidationMessage.classList.remove('d-none');
          numberSpam.innerText = String(Math.round(sumPayPerValue(elementCollection) * 100)/100);
        } else {
          elementValidationMessage.classList.add('d-none');
        }
      });
    }
  }
  
  function sumPayPerValue(inputCollection: HTMLCollection){
    let sumPer = 0;
  
    for (let input of inputCollection){
      if(input instanceof HTMLInputElement){
        sumPer += Number(input.value);
      }
    }
  
    return sumPer 
  }
  
  export { validatePayPer }