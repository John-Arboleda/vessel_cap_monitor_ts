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

  const typeHeaderRow = document.createElement('TR');
  typeHeaderRow.innerHTML = `
    <td scope="row" colspan="3" class="text-center">
      <label>
        <small class="form-text text-muted">Total percentage reduction of the ship orderbook</small>
      </label>
    </td>
  `;

  tbody.appendChild(typeHeaderRow);

  vesselTypes.forEach((type, typeId) => {
    const typeRow = vesselTypeRow(vesselId, typeId, type);
    tbody.appendChild(typeRow);
  });

  const agep1HeaderRow = document.createElement('TR');
  agep1HeaderRow.innerHTML = `
    <td scope="row" colspan="3" class="text-center">
      <label>
        <small class="form-text text-muted">New vessels lifecycle</small>
      </label>
    </td>
  `;

  tbody.appendChild(agep1HeaderRow);

  vesselTypes.forEach((type, typeId) => {
    const typeRow = rang1TypeRow(vesselId, typeId, type);
    tbody.appendChild(typeRow);
  });

  const rang1HeaderRow = document.createElement('TR');
  rang1HeaderRow.innerHTML = `
    <td scope="row" colspan="3" class="text-center">
      <label>
        <small class="form-text text-muted">Timeframe for gradual ship orderbook reduction</small>
      </label>
    </td>
  `;

  tbody.appendChild(rang1HeaderRow);

  vesselTypes.forEach((type, typeId) => {
    const typeRow = agep1TypeRow(vesselId, typeId, type);
    tbody.appendChild(typeRow);
  });

  return bigRow;
}

function vesselTypeRow (vesselId: number, typeId: number, typeName: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.innerHTML = `
  <td colspan="2">
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

function rang1TypeRow (vesselId: number, typeId: number, typeName: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.innerHTML = `
    <td class="home">
        <label>
            <small class="form-text text-muted">${typeName}</small>
        </label>
    </td>
    <td class="home">
        <input 
            type="number"
            class="form-control
            static-input year"
            id="input-rang1-${vesselId}-${typeId}-0"
            name="input-rang1-${vesselId}-${typeId}-0"
            step="1"
            min="2025"
            max="2050"
            value="2030"
            required
        >
    </td>
    <td class="home">
        <input 
            type="number"
            class="form-control
            static-input year"
            id="input-rang1-${vesselId}-${typeId}-1"
            name="input-rang1-${vesselId}-${typeId}-1"
            step="1"
            min="2026"
            max="2050"
            value="2050"
            required
        >
    </td>
  `

  return row;
}

function agep1TypeRow (vesselId: number, typeId: number, typeName: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.innerHTML = `
    <td class="home" colspan="2">
        <label>
            <small class="form-text text-muted">${typeName}</small>
        </label>
    </td>
    <td class="home">
        <input 
            type="number"
            class="form-control
            static-input"
            id="input-agep1-${vesselId}-${typeId}"
            name="input-agep1-${vesselId}-${typeId}"
            step="1"
            min="1"
            max="50"
            value="20"
            required
        >
    </td>
  `

  return row;
}

export { createVesselInputs };