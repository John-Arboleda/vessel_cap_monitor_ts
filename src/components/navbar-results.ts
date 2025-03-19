
function navbarResultsScroll(): void {
    const mainPanel = document.getElementById('main-panel') as HTMLElement;
    // Get the navbar
    const strategiesResultNavbar = document.getElementById('strategies-result-navbar') as HTMLElement;
    const capacityResultNavbar = document.getElementById('capacity-result-navbar') as HTMLElement;
  
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
      makeStickyNavbar(strategiesResultNavbar); 
      makeStickyNavbar(capacityResultNavbar); 
    };
  }
  
  function resultNavbarState(navPrefix: string){
    const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;
    const selectTechnology = document.getElementById(navPrefix + '_select_tech') as HTMLSelectElement;
    const selectSize = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;
  
    console.log(navPrefix);
    const navObj = {
      percentText: percentButton.innerHTML,
      techKeys: selectTechnology.value.split("").map((a: String) => Number(a)),
      sizeKeys: selectSize.value.split("").map((a: String) => Number(a)),
    }
  
    return navObj
  }
  
  export { navbarResultsScroll, resultNavbarState };