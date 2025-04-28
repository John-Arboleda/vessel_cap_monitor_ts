import { vesselData } from "../logic/data";

function createVesselInputs():void{

  const vesselCollapse = document.getElementById('vessel-collapse') as HTMLTableElement;

  const vesselNames: string[] = ["Crude Tanker", "Product Tanker", "LNG", "LPG", "Bulker"];

  vesselNames.forEach((name, id) => {
    const header = vesselHeader(id, name);
    vesselCollapse.appendChild(header);
    const body = vesselBody(id, vesselData[id]["sizesHTML"]);
    vesselCollapse.appendChild(body);
  })
}

function vesselHeader(vesselId: number, vesselName: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.classList.add('nested-table-header', 'bg-transparent', 'cursor-pointer');
  row.setAttribute('data-bs-toggle', 'collapse');
  row.setAttribute('data-bs-target', `#vessel-${vesselId}-collapse`);
  row.setAttribute('aria-expanded', 'true');
  row.innerHTML = `
      <td colspan="2" class="text-center">
        <small class="form-text text-muted">
          <b>${vesselName}</b>
        </small>
      </td>
      `
  return row;
}

function vesselBody(vesselId: number, vesselTypes: string[]): HTMLTableRowElement{
  
  const bigRow = document.createElement('TR') as HTMLTableRowElement;
  bigRow.id = `vessel-${vesselId}-collapse`;
  bigRow.classList.add('lh-1', 'bg-transparent', 'collapse');

  const td = document.createElement('td');
  td.colSpan = 2;

  const innerTable = document.createElement('table');
  innerTable.classList.add('table', 'table-bordered', 'table-hover', 'align-middle', 'mb-0', 'bg-light');

  const tbody = document.createElement('tbody');
  tbody.id = `vessel-${vesselId}-body`;
  tbody.classList.add('lh-1', 'bg-transparent');

  innerTable.appendChild(tbody);
  td.appendChild(innerTable);
  bigRow.appendChild(td);

  const rfRow = document.createElement('TR');
  rfRow.innerHTML = `
    <td colspan="2">
      <div class="d-flex justify-content-between">
        <label for="input-RF-${vesselId}" class="form-label">
          <small class="form-text text-muted">RF</small>
        </label>
        <small id="per_input-RF-${vesselId}" class="form-text text-muted">0.0</small>
      </div>
      <input 
        id="input-RF-${vesselId}" 
        type="range" 
        class="form-range 
        static-input" 
        min="0" 
        max="1" 
        step="0.01" 
        value="0.0"
      >
      <div class="input-RF-${vesselId}_legend d-flex justify-content-between">
        <small class="text-muted">0</small>
        <small class="text-muted">1</small>
      </div>
    </td>
  `;

  const typeHeaderRow = document.createElement('TR');
  typeHeaderRow.innerHTML = `
    <td scope="row" colspan="2" class="text-center">
      <label>
        <small class="form-text text-muted">Total percentage reduction of the ship orderbook</small>
      </label>
    </td>
  `;
  
  tbody.appendChild(rfRow);
  tbody.appendChild(typeHeaderRow);

  vesselTypes.forEach((type, typeId) => {
    const typeRow = vesselTypeRow(vesselId, typeId, type);
    tbody.appendChild(typeRow);
  });

  return bigRow;
}

function vesselTypeRow (vesselId: number, typeId: number, typeName: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.innerHTML = `
  <td>
    <label>
      <small class="form-text text-muted">${typeName}</small>
    </label>
  </td>
  <td>
    <input 
      type="number"
      class="form-control static-input percent"
      id="input-delta-${vesselId}-${typeId}"
      name="input-delta-${vesselId}-${typeId}"
      step="1"
      min="0"
      max="100"
      value="0"
      required>
  </td>
  `
  return row;
}

export { createVesselInputs };