type category = "smartphone" | "laptop" | "monitor" | "headphone";



export interface VariantBase {
  id: string;
  name: string;
  basePrice: number;
  rating: number;
  stock: boolean;
  brand: string;

  performanceScore: number;   // 1-10
  batteryScore?: number;      // 1-10
  cameraScore?: number;       // 1-10
  displayScore?: number;      // 1-10
  buildQualityScore?: number; // 1-10
  portabilityScore?: number;  // 1-10
  audioScore?: number;        // 1-10
  valueScore?: number;        // calculated later

  specs: Record<string, string | number>;
}

export type Product = {
    id : number;
    category : category;
    name :string;
    variants : VariantBase[]

}

export const mockDatabase: Product[] = [

  {
    id: 1,
    category: "smartphone",
    name: "iPhone 15",
    variants: [
      {
        id: "iphone15-128",
        name: "iPhone 15 128GB",
        brand: "Apple",
        basePrice: 69999,
        rating: 4.5,
        stock: true,

        performanceScore: 9,
        cameraScore: 9,
        batteryScore: 8,
        displayScore: 9,
        buildQualityScore: 9,

        specs: {
          storage: "128GB",
          processor: "A16 Bionic",
          display: "6.1 inch OLED",
          battery: "3349mAh",
          refreshRate: "60Hz"
        }
      },
      {
        id: "iphone15-256",
        name: "iPhone 15 256GB",
        brand: "Apple",
        basePrice: 79999,
        rating: 4.6,
        stock: true,

        performanceScore: 9,
        cameraScore: 9,
        batteryScore: 8,
        displayScore: 9,
        buildQualityScore: 9,

        specs: {
          storage: "256GB",
          processor: "A16 Bionic",
          display: "6.1 inch OLED",
          battery: "3349mAh",
          refreshRate: "60Hz"
        }
      }
    ]
  },
  {
    id: 2,
    category: "smartphone",
    name: "Samsung Galaxy S23",
    variants: [
      {
        id: "s23-128",
        name: "Samsung Galaxy S23 128GB",
        brand: "Samsung",
        basePrice: 64999,
        rating: 4.4,
        stock: true,

        performanceScore: 9,
        cameraScore: 8,
        batteryScore: 8,
        displayScore: 9,
        buildQualityScore: 8,

        specs: {
          storage: "128GB",
          processor: "Snapdragon 8 Gen 2",
          display: "6.1 inch AMOLED",
          battery: "3900mAh",
          refreshRate: "120Hz"
        }
      }
    ]
  },

  
  {
    id: 3,
    category: "laptop",
    name: "MacBook Air M2",
    variants: [
      {
        id: "mba-m2-8gb",
        name: "MacBook Air M2 8GB RAM",
        brand: "Apple",
        basePrice: 99999,
        rating: 4.7,
        stock: true,

        performanceScore: 9,
        batteryScore: 10,
        displayScore: 9,
        portabilityScore: 10,
        buildQualityScore: 9,

        specs: {
          ram: "8GB",
          storage: "256GB SSD",
          processor: "M2 Chip",
          display: "13.6 inch Retina",
          weight: "1.24kg"
        }
      }
    ]
  },
  {
    id: 4,
    category: "laptop",
    name: "Dell XPS 13",
    variants: [
      {
        id: "xps13-16gb",
        name: "Dell XPS 13 16GB",
        brand: "Dell",
        basePrice: 109999,
        rating: 4.5,
        stock: true,

        performanceScore: 8,
        batteryScore: 8,
        displayScore: 9,
        portabilityScore: 9,
        buildQualityScore: 8,

        specs: {
          ram: "16GB",
          storage: "512GB SSD",
          processor: "Intel i7",
          display: "13.4 inch FHD+",
          weight: "1.2kg"
        }
      }
    ]
  },


  {
    id: 5,
    category: "headphone",
    name: "Sony WH-1000XM5",
    variants: [
      {
        id: "sony-xm5",
        name: "Sony WH-1000XM5",
        brand: "Sony",
        basePrice: 29999,
        rating: 4.6,
        stock: true,

        performanceScore: 8,
        batteryScore: 9,
        audioScore: 10,
        buildQualityScore: 9,
        portabilityScore: 8,

        specs: {
          type: "Over-ear",
          noiseCancellation: "Active",
          batteryLife: "30 hours",
          bluetooth: "5.2"
        }
      }
    ]
  },


  {
    id: 6,
    category: "monitor",
    name: "LG UltraGear 27\"",
    variants: [
      {
        id: "lg-ultragear-27",
        name: "LG UltraGear 27 inch",
        brand: "LG",
        basePrice: 25999,
        rating: 4.4,
        stock: true,

        performanceScore: 8,
        displayScore: 9,
        buildQualityScore: 8,
        portabilityScore: 6,

        specs: {
          size: "27 inch",
          resolution: "1440p",
          refreshRate: "144Hz",
          panel: "IPS"
        }
      }
    ]
  }
];