# Adatmodell


## Entitások

**User**
- Regisztráció (C)
- Profil megtekintése (R)
- Profil szerkesztése (u)
- Fiók törlése (D)

**Food**
- Új étel (C)
- Böngészés + részletes nézet (R)
- Saját recept szerkesztése (u)
- Saját recept törlése (D)

**LogEntry**
- Egy új bejegyzés (akarmilyen kalóriát tartalmazó adatról) (C)
- Felírt bejegyzés listázása (R)
- Bejegyzés szerkesztése (U)
- Bejegyzés törlése (D)

**WaterLog**
- Egy új bejegyzés (viz) (C)
- Napi vizmennyiség listázása (R)
- Vizmennyiség szerkesztése (U)
- Vizmennyiség törlése (D)

**WeightHistory**
- Uj mérés (kg) (C)
- Progress Chart (R)
- Tömeg/Dátum szerkesztése (U)
- Mérés törlése (D)

---

## Kapcsolatok

- **User ↔ LogEntry | (1:N)** | Egy felhasználónak sok naplóbejegyzése lehet az idők során, de egy konkrét naplóbejegyzés mindig csak egyetlen felhasználóhoz tartozik
- **User ↔ WaterLog | (1:N)** | Egy felhasználó naponta többször is rögzíthet vízbevitelt
- **User ↔ WeightHistory | (1:N)** | Egy felhasználónak több súlymérési adata van
- **User ↔ Food | (N:M)** | Sok felhasználó eszik sokféle ételt és ételek több felhasználóhoz tartozhat
- **Food ↔ LogEntry | 1:N** | Egy konkrét élelmiszer szerepelhet rengeteg különböző naplóbejegyzésben

---

## Adatstruktúra (Mezők)

**Users** - `id`: string
- `name`: string
- `email`: string
- `birthDate`: date
- `gender`: enum (male/female/other)
- `currentWeight`: number
- `height`: number
- `activityLevel`: number
- `dailyCalorieGoal`: number

**Food** - `id`: string
- `name`: string 
- `brand`: string (Gyártó neve, ha bolti termék)
- `caloriesPer100g`: number (Energiatartalom kcal-ban)
- `protein`: number (Fehérje g/100g)
- `carbs`: number (Szénhidrát g/100g)
- `fat`: number (Zsír g/100g)
- `barcode`: string (Opcionális, vonalkódos kereséshez)

**LogEntry** - `id`: string
- `userId`: string
- `foodId`: string
- `amount`: number
- `mealType`: enum (breakfast / lunch / dinner / snack)
- `timestamp`: datetime

**WaterLog** - `id`: string
- `userId`: string
- `amountMI`: number (Bevitt mennyiség milliliterben)
- `timestamp`: datetime

**WeightHistory** - `id`: string
- `userId`: string
- `weight`: number
- `measuredAt`: date