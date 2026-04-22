import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import * as foodRepository from "../repositories/foodRepository.js";
import { query } from "../config/db.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const testFoods = [
  {
    name: "Alma",
    brand: "Natural",
    caloriesper100g: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    barcode: "5000112126990",
    ispublic: true,
  },
  {
    name: "Banán",
    brand: "Natural",
    caloriesper100g: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    barcode: "5000112126991",
    ispublic: true,
  },
  {
    name: "Marha Pizza",
    brand: "Frozen Delights",
    caloriesper100g: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    barcode: "5000112126992",
    ispublic: true,
  },
  {
    name: "Hamburger",
    brand: "Fast Food",
    caloriesper100g: 215,
    protein: 15,
    carbs: 20,
    fat: 9,
    barcode: "5000112126993",
    ispublic: true,
  },
  {
    name: "Csirkemellfilé",
    brand: "Fresh",
    caloriesper100g: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    barcode: "5000112126994",
    ispublic: true,
  },
  {
    name: "Joghurt",
    brand: "Dairy Co",
    caloriesper100g: 59,
    protein: 3.5,
    carbs: 4.7,
    fat: 0.4,
    barcode: "5000112126995",
    ispublic: true,
  },
  {
    name: "Teljes kiőrlésű kenyér",
    brand: "Baker's Best",
    caloriesper100g: 247,
    protein: 8.4,
    carbs: 41.7,
    fat: 3.3,
    barcode: "5000112126996",
    ispublic: true,
  },
  {
    name: "Rizs (főzött)",
    brand: "Natural",
    caloriesper100g: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    barcode: "5000112126997",
    ispublic: true,
  },
  {
    name: "Brokkoli",
    brand: "Fresh",
    caloriesper100g: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    barcode: "5000112126998",
    ispublic: true,
  },
  {
    name: "Tojás",
    brand: "Farm Fresh",
    caloriesper100g: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    barcode: "5000112126999",
    ispublic: true,
  },
];

async function seedData() {
  console.log("🌱 Kezdete az étel adatok szúrásának...");

  try {
    // Töröljük az összes régi adatot
    console.log("🗑️  Régi adatok törlése...");
    await query("DELETE FROM food");
    console.log("✅ Törlésre kerültek az adatok\n");

    // Szúrj be új ételeket
    let insertedCount = 0;
    for (const food of testFoods) {
      try {
        await foodRepository.createFood(food);
        insertedCount++;
        console.log(`✅ Szúrva: ${food.name}`);
      } catch (error) {
        if (error.message.includes("already exists")) {
          console.log(`⚠️  Már létezik: ${food.name}`);
        } else {
          console.error(`❌ Hiba: ${food.name}`, error.message);
        }
      }
    }

    console.log(`\n✨ Sikeresen szúrva ${insertedCount} étel az adatbázisba!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Hiba az adatok szúrásakor:", error);
    process.exit(1);
  }
}

seedData();
