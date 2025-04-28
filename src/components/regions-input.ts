import { regionsData } from "../logic/data";

function createRegionInputs():void{

  const regionCollapse = document.getElementById('region-collapse') as HTMLTableElement;

  regionsData.forEach((name, id) => {
    const header = regionHeader(id, name);
    regionCollapse.appendChild(header);
    const body = regionBody(id);
    regionCollapse.appendChild(body);
  })
}

function regionHeader(regionId: number, regionTitle: string): HTMLTableRowElement {
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.classList.add('nested-table-header', 'bg-transparent', 'cursor-pointer');
  row.setAttribute('data-bs-toggle', 'collapse');
  row.setAttribute('data-bs-target', `#region-${regionId}-collapse`);
  row.setAttribute('aria-expanded', 'true');
  row.innerHTML = `
      <td colspan="2" class="text-center">
        <small class="form-text text-muted">
          <b>${regionTitle}</b>
        </small>
      </td>`
  return row;
}

function regionBody(regionId: number): HTMLTableRowElement{
  
  const row = document.createElement('TR') as HTMLTableRowElement;
  row.id = `region-${regionId}-collapse`;
  row.classList.add('lh-1', 'bg-transparent', 'collapse');
  
  row.innerHTML = `
      <td colspan="2">
        <table class="table table-bordered table-hover align-middle mb-0 bg-light">
          <tbody class="lh-1 bg-transparent">

            <tr>
              <td class="home">
                <label>
                  <small class="form-text text-muted">Activate Region</small>
                </label>
              </td>
              <td class="home">
                <input 
                  type="number"
                  class="form-control
                  static-input"
                  id="input-ONES-${regionId}"
                  name="input-ONES-${regionId}"
                  step="1"
                  min="0"
                  max="1"
                  value="0"
                  required
                >
              </td>
            </tr>

            <tr>
              <td scope="row" colspan="2" class="text-center">
                <label>
                  <small class="form-text text-muted">Exports</small>
                </label>
              </td>
            </tr>

            <tr>
              <td colspan="2">
                <div class="d-flex justify-content-between">
                  <label for="input-beta-0-${regionId}" class="form-label">
                    <small class="form-text text-muted">Reduction in exports</small>
                  </label>
                  <small id="per_input-beta-0-${regionId}" class="form-text text-muted">0.0</small>
                </div>

                <input 
                  id="input-beta-0-${regionId}"
                  type="range"
                  class="form-range
                  static-input"
                  min="-1"
                  max="0"
                  step="0.01"
                  value="0.0"
                >
                
                <div class="input-beta-0-${regionId}_legend d-flex justify-content-between">
                  <small class="text-muted">No exports</small>
                  <small class="text-muted">Current</small>
                </div>
              </td>
            </tr>

            <tr>
              <td class="home">
                <label>
                  <small class="form-text text-muted">Start of policy</small>
                </label>
              </td>
              <td class="home">
                <input 
                  type="number"
                  class="form-control
                  static-input year"
                  id="input-PARR-0-${regionId}"
                  name="input-PARR-0-${regionId}"
                  step="1"
                  min="2025"
                  max="2050"
                  value="2025"
                  required
                >
              </td>
            </tr>

            <tr>
              <td class="home">
                <label>
                  <small class="form-text text-muted">End of policy</small>
                </label>
              </td>
              <td class="home">
                <input
                  type="number"
                  class="form-control
                  static-input year"
                  id="input-PARR-1-${regionId}"
                  name="input-PARR-1-${regionId}"
                  step="1"
                  min="2026"
                  max="2050"
                  value="2035"
                  required
                >
              </td>
            </tr>

            <tr>
              <td scope="row" colspan="2" class="text-center">
                <label>
                  <small class="form-text text-muted">Imports</small>
                </label>
              </td>
            </tr>

            <tr>
              <td colspan="2">
                <div class="d-flex justify-content-between">
                  <label for="input-beta-1-${regionId}" class="form-label">
                    <small class="form-text text-muted">Reduction in imports</small>
                  </label>
                  <small id="per_input-beta-1-${regionId}" class="form-text text-muted">0.0</small>
                </div>
                <input 
                  id="input-beta-1-${regionId}"
                  type="range"
                  class="form-range
                  static-input"
                  min="-1"
                  max="0"
                  step="0.01"
                  value="0.0"
                >
                <div class="input-beta-1-${regionId}_legend d-flex justify-content-between">
                  <small class="text-muted">No imports</small>
                  <small class="text-muted">Current</small>
                </div>
              </td>
            </tr>

            <tr>
              <td class="home">
                <label>
                  <small class="form-text text-muted">Start of policy</small>
                </label>
              </td>
              <td class="home">
                <input 
                  type="number"
                  class="form-control
                  static-input year"
                  id="input-PARR-2-${regionId}"
                  name="input-PARR-2-${regionId}"
                  step="1"
                  min="2025"
                  max="2050"
                  value="2025"
                  required
                >
              </td>
            </tr>

            <tr>
              <td class="home">
                <label>
                  <small class="form-text text-muted">End of policy</small>
                </label>
              </td>
              <td class="home">
                <input 
                  type="number"
                  class="form-control
                  static-input year"
                  id="input-PARR-3-${regionId}"
                  name="input-PARR-3-${regionId}"
                  step="1"
                  min="2026"
                  max="2050"
                  value="2035"
                  required
                >
              </td>
            </tr>

          </tabody>
        </tble>
      </td>
    `
  return row;
}

export { createRegionInputs };