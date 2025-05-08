import { createResultRegionSelect } from "./result-input-route";
import { updateRoute } from "./result-input-route";
import { vesselData } from "../logic/data";

function navbarResultsScroll(): void {

  const mainPanel = document.getElementById('main-panel') as HTMLElement;
  // Get the navbar
  const vesselsResultNavbar = document.getElementById('vessels-result-navbar') as HTMLElement;
  const capacityResultNavbar = document.getElementById('capacity-result-navbar') as HTMLElement;
  const productivityResultNavbar = document.getElementById('productivity-result-navbar') as HTMLElement;

  // Add the sticky class to the navbar when you reach its scroll position.
  // Remove "sticky" when you leave the scroll position
  function makeStickyNavbar(navbar: HTMLElement): void {
    // Get the offset position of the navbar
    const sticky: number = navbar.offsetTop;

    if (mainPanel.scrollTop > sticky) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }

  // When the user scrolls the page, execute makeStickyNavbar
  mainPanel.onscroll = function (): void { 
    makeStickyNavbar(vesselsResultNavbar); 
    makeStickyNavbar(capacityResultNavbar); 
    makeStickyNavbar(productivityResultNavbar); 
  };
  
  customVesselSize(vesselsResultNavbar); 
  customVesselSize(capacityResultNavbar); 
  customVesselSize(productivityResultNavbar); 

  // Create regions select
  createResultRegionSelect();
}
  
function resultNavbarState(navPrefix: string){

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;
  const selectVessel = document.getElementById(navPrefix + '_select_vessel') as HTMLSelectElement;
  const selectSize = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;
  const origin_select = document.getElementById(navPrefix + '_select_region_origin') as HTMLSelectElement;
  const destination_select = document.getElementById(navPrefix + '_select_region_dest') as HTMLSelectElement;

  const navObj = {
    percentText: percentButton.innerHTML,
    vesselKeys: selectVessel.value.split("").map((a: String) => Number(a)),
    sizeKeys: selectSize.value.split("").map((a: String) => Number(a)),
    routesKeys: updateRoute(origin_select.value, destination_select.value)
  }
  
  return navObj
}

function customVesselSize(resultNavbar: HTMLElement):void {

  const vesselSelect: HTMLSelectElement = resultNavbar.querySelector(".vessels-select") as HTMLSelectElement;
  const sizeSelect: HTMLSelectElement = resultNavbar.querySelector(".size-select") as HTMLSelectElement;

  vesselSelect.addEventListener('change', () => {
    
    sizeSelect.innerHTML = "";
    const vesselId: string = vesselSelect.value

    if(vesselId.length > 1){
      sizeSelect.innerHTML = `
        <option value="01234" selected>All sizes</option>
        <option value="0">Size 1</option>
        <option value="1">Size 2</option>
        <option value="2">Size 3</option>
        <option value="3">Size 4</option>
        <option value="4">Size 5</option> 
      `;
    } else if((vesselId === "0") || (vesselId === "4")){

      const vesselSizes: string[] = vesselData[vesselId]["sizesHTML"]
      
      sizeSelect.innerHTML = `
        <option value="01234" selected>All sizes</option>
        <option value="0">${vesselSizes[0]}</option>
        <option value="1">${vesselSizes[1]}</option>
        <option value="2">${vesselSizes[2]}</option>
        <option value="3">${vesselSizes[3]}</option>
      `;
    } else {

      const vesselSizes: string[] = vesselData[vesselId]["sizesHTML"]
      
      sizeSelect.innerHTML = `
        <option value="01234" selected>All sizes</option>
        <option value="0">${vesselSizes[0]}</option>
        <option value="1">${vesselSizes[1]}</option>
        <option value="2">${vesselSizes[2]}</option>
        <option value="3">${vesselSizes[3]}</option>
        <option value="4">${vesselSizes[4]}</option> 
      `;
    }
  })

}


  
export { navbarResultsScroll, resultNavbarState };