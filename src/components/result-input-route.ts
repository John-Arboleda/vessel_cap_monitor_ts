import { regionsData, routesData } from '../logic/data';

function createResultRegionSelect() {

  setupRegionSelectors('vessels');
  setupRegionSelectors('capacity');
  setupRegionSelectors('productivity');

}

// Function to populate a select element with regions
function populateRegionSelect(selectElement: HTMLSelectElement, type: string) {
  // Optionally add a default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';  // default value for all regions
  defaultOption.text = 'All '+ type;
  selectElement.appendChild(defaultOption);

  const allRegionsArr = [...Array.from({ length: regionsData.length }, (_, i) => i - 1)];
  defaultOption.value = allRegionsArr.join(',');

  regionsData.forEach((region, index) => {
      const option = document.createElement('option');
      option.value = index.toString();  // store index as value
      option.text = region;
      selectElement.appendChild(option);
  });
}

// Function to find route id by origin and destination ids
function findRouteId(originId: number, destId: number): number | null {
  const route = routesData.find(r => r.origin_id === originId && r.dest_id === destId);
  return route ? route.id : null;
}

// Example initialization function to set up the dropdowns
function setupRegionSelectors(navbarPrefix: string) {
  const originSelect = document.getElementById(`${navbarPrefix}_select_region_origin`) as HTMLSelectElement;
  const destinationSelect = document.getElementById(`${navbarPrefix}_select_region_dest`) as HTMLSelectElement;
  //const resultDiv = document.getElementById('route_result');

  populateRegionSelect(originSelect, 'Origins');
  populateRegionSelect(destinationSelect, 'Destinations');

}

function updateRoute(originValue: string, destValue: string): number[] {
  if (originValue.length < 19 && destValue.length < 19) {
    const originId = parseInt(originValue, 10);
    const destId = parseInt(destValue, 10);
    const routeId = findRouteId(originId, destId);
    return routeId !== null ? [routeId] : [];
  } else if (originValue.length > 19 && destValue.length > 19) {
    const allRoutes = [...Array.from({ length: 190 }, (_, i) => i)];
    return allRoutes;
  } else if (originValue.length > 19 && destValue.length < 19) {
    const allOrigins = routesData.filter(r => r.dest_id === parseInt(destValue, 10)).map(r => r.id);
    const uniqueOrigins = [...new Set(allOrigins)];
    return uniqueOrigins;
  } else if (originValue.length < 19 && destValue.length > 19) {
    const allDestinations = routesData.filter(r => r.origin_id === parseInt(originValue, 10)).map(r => r.id);
    const uniqueDestinations = [...new Set(allDestinations)];
    return uniqueDestinations;
  }

  // Default case: return an empty array if no conditions are met
  return [];
}

export { createResultRegionSelect, setupRegionSelectors, updateRoute };