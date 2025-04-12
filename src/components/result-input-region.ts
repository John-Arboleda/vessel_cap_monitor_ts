
function createResultRegionSelect(){

    const strategiesRegionSelect = document.getElementById('strategies_select_region') as HTMLSelectElement;
    const capacityRegionSelect = document.getElementById('capacity_select_region') as HTMLSelectElement;

    appendRegionOptions(strategiesRegionSelect);
    appendRegionOptions(capacityRegionSelect);
    
}

function appendRegionOptions(selectElement: HTMLSelectElement){

    let regionsPairArr = [];

    for(let r = 0; r < 190; r++){
      regionsPairArr.push(r);
    }

    const allRegionsOption: HTMLOptionElement = optionRegion(regionsPairArr.join(","), "All Routes");

    selectElement.appendChild(allRegionsOption);

    regionsPairArr.forEach((opt: number) => {
        const optElement = optionRegion(opt.toString(), `Route ${opt + 1}`);
        selectElement.appendChild(optElement);
    })
}

function optionRegion(optionString: string, optionText: string): HTMLOptionElement{
    const optionElement = document.createElement('OPTION') as HTMLOptionElement;
    optionElement.value = optionString;
    optionElement.innerHTML = optionText;
    return optionElement;
}

export { createResultRegionSelect }