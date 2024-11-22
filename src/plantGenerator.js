export function generatePlants(gl, numOfPlants = 20) {
    const lSystemPlants = [];
  
    
    for (let i = 0; i < numOfPlants; i++) {
      const axiom = "F";
      const rules = {
        "F": "FF+[+F-F-F]-[-F+F+F]",
      };
  
      const position = [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ];
      const scale = 10;
      const iters = 2;
  
      const plant = new LsystemPlant(gl, axiom, rules, iters, scale, position);
      lSystemPlants.push(plant);
    }
  
    return lSystemPlants;
  }
  
  export function renderPlants(plants, camera) {
    
    for (const plant of plants) {
      plant.render(camera);
    }
  }
  