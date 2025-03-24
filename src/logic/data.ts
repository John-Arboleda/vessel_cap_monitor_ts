const regionsData = [
    "Western Asia",
    "Eastern Europe",
    "South America",
    "Middle Africa",
    "Northern Europe",
    "Western Europe",
    "Central America",
    "Southern Asia",
    "Northern America",
    "Northern Africa",
    "South-eastern Asia",
    "Western Africa",
    "Central Asia",
    "Oceania",
    "Caribbean",
    "Eastern Africa",
    "Southern Europe",
    "Eastern Asia",
    "Southern Africa"
]

interface VesselData {
    [key: string]: string[];
}

const vesselData: VesselData = {
    "Crude Tanker": [
        "VLCC", 
        "Suezmax", 
        "Aframax", 
        "Panamax", 
        "Handysize"
    ], 
    "Product Tanker": [
        "Suezmax", 
        "Aframax", 
        "Panamax", 
        "Handysize", 
        "Small",
    ], 
    "LNG": [
        "<40K m<sup>3</sup>", 
        "40-59,999 m<sup>3</sup>", 
        "60-99,999 m<sup>3</sup>", 
        "100-139,999 m<sup>3</sup>", 
        ">140,000 m<sup>3</sup>"
    ], 
    "LPG": [
        "<5,000 m<sup>3</sup>", 
        "5-20,000 m<sup>3</sup>", 
        "20-44,999 m<sup>3</sup>", 
        "45-64,999 m<sup>3</sup>", 
        "65,000+ m<sup>3</sup>" 
    ], 
    "Bulker": [
        "Capesize", 
        "Panamax", 
        "Handymax", 
        "Handysize"
    ]
}

export { regionsData, vesselData };
// export type { VesselData };
