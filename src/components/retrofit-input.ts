
function createRetrofitInputs():void{

  const retrofitCollapse = document.getElementById('retrofit-collapse') as HTMLTableElement;

  const vesselNames: string[] = ["Crude Tanker", "Product Tanker", "LNG", "LPG", "Bulker"];

  vesselNames.forEach((name, id) => {
    const header = vesselHeader(id, name);
    retrofitCollapse.appendChild(header);
    const body = vesselBody(id);
    retrofitCollapse.appendChild(body);
  })
}

function vesselHeader(vesselId: number, vesselName: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.classList.add('nested-table-header', 'bg-transparent', 'cursor-pointer');
  row.setAttribute('data-bs-toggle', 'collapse');
  row.setAttribute('data-bs-target', `#retrofit-${vesselId}-collapse`);
  row.setAttribute('aria-expanded', 'true');
  row.innerHTML = `
      <td colspan="3" class="text-center">
        <small class="form-text text-muted">
          <b>${vesselName}</b>
        </small>
      </td>
      `
  return row;
}

function vesselBody(vesselId: number): HTMLTableRowElement{
  
  const bigRow = document.createElement('TR') as HTMLTableRowElement;
  bigRow.id = `retrofit-${vesselId}-collapse`;
  bigRow.classList.add('lh-1', 'bg-transparent', 'collapse');

  const td = document.createElement('td');
  td.colSpan = 2;

  const innerTable = document.createElement('table');
  innerTable.classList.add('table', 'table-bordered', 'table-hover', 'align-middle', 'mb-0', 'bg-light');

  const tbody = document.createElement('tbody');
  tbody.id = `retrofit-${vesselId}-body`;
  tbody.classList.add('lh-1', 'bg-transparent');

  innerTable.appendChild(tbody);
  td.appendChild(innerTable);
  bigRow.appendChild(td);

  const rfRow = document.createElement('TR');
  rfRow.innerHTML = `
    <td colspan="2">
      <div class="d-flex justify-content-between">
        <label for="input-RF-${vesselId}" class="form-label">
          <small class="form-text text-muted">Total percentage increase in ship retrofits</small>
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

  const agep2Row = document.createElement('TR');
  agep2Row.innerHTML = `
    <td scope="row">
        <label for="input-agep2-${vesselId}">
            <small class="form-text text-muted">Retrofitted vessels lifecycle</small>
        </label>
    </td>
    <td class="home">
        <input type="number" class="form-control static-input" id="input-agep2-${vesselId}" name="input-agep2-${vesselId}" value="10" min="1" max="50" step="1" required>
    </td>
  `;

  const typeHeaderRow = document.createElement('TR');
  typeHeaderRow.innerHTML = `
    <td scope="row" colspan="2" class="text-center">
      <label>
        <small class="form-text text-muted">Timeframe for gradual ship orderbook reduction</small>
      </label>
    </td>
  `;

  const rang2StartRow = document.createElement('TR');
  rang2StartRow.innerHTML = `
    <td class="home">
        <label>
            <small class="form-text text-muted">Start year</small>
        </label>
    </td>
    <td class="home">
        <input 
            type="number"
            class="form-control
            static-input year"
            id="input-rang2-${vesselId}-0"
            name="input-rang2-${vesselId}-0"
            step="1"
            min="2025"
            max="2050"
            value="2030"
            required
        >
    </td>
  `;

  const rang2EndRow = document.createElement('TR');
  rang2EndRow.innerHTML = `
    <td class="home">
        <label>
            <small class="form-text text-muted">End year</small>
        </label>
    </td>
    <td class="home">
        <input 
            type="number"
            class="form-control
            static-input year"
            id="input-rang2-${vesselId}-1"
            name="input-rang2-${vesselId}-1"
            step="1"
            min="2026"
            max="2050"
            value="2050"
            required
        >
    </td>
  `;

  
  
  tbody.appendChild(rfRow);
  tbody.appendChild(agep2Row);
  tbody.appendChild(typeHeaderRow);
  tbody.appendChild(rang2StartRow);
  tbody.appendChild(rang2EndRow);

//   vesselTypes.forEach((type, typeId) => {
//     const typeRow = vesselTypeRow(vesselId, typeId, type);
//     tbody.appendChild(typeRow);
//   });

  return bigRow;
}

export { createRetrofitInputs };