import { transformData } from "../logic/functions";
// import { defaultValues } from "../data";
import { objValues, drawActivePanel, updateObj} from "../update";



function createNavEvents(): void{

  const navItems = document.querySelectorAll(".navbar-item");

  navItems.forEach((navItem: Element) => {
    navItem.addEventListener("click", async () => {

      
      const objData = updateObj(objValues);
      console.log("objData",objData)

      const resultObj = await transformData(objData);
      console.log("resultObj",resultObj)

      const mainNavbar = document.getElementById('main-navbar') as HTMLElement;
      const activeLink = mainNavbar.querySelector('.active') as HTMLElement;
      activeLink.classList.remove('active');

      const navLink = navItem.querySelector('.nav-link') as HTMLElement;
      navLink.classList.add('active');
    
      const id = navItem.getAttribute('id')!;
      const panelId = id.replace('nav-button', 'panel');
    
      const panels = document.querySelectorAll('.panel');
      panels.forEach((panel: Element) => {
        panel.classList.add('d-none');
      });
    
      const panelToShow = document.getElementById(panelId) as HTMLElement;
      panelToShow.classList.remove('d-none');

      drawActivePanel(resultObj);

    });
  });
}

// function resizeSummaryPanel(): void {
//   const summaryPanel = document.getElementById('summary-panel') as HTMLElement;
//   window.addEventListener('resize', () => {
//     if (!summaryPanel.classList.contains('d-none')) {
//       runSummaryCharts();
//     }
//   });
// }

export { createNavEvents };