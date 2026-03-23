# LockIn

**Webes alkalmazás specifikáció**
**Programrendszerek fejlesztése gyakorlat**
**MEAN Stack – Demonstrációs projekt**
**2026. tavasz**

---

## 1. Bevezetés

A LockIn egy modern, felhasználóbarát webalkalmazás, amely a tudatos életmód támogatására jött létre. Az alkalmazás nem csupán egy egyszerű kalóriaszámláló, hanem egy komplex táplálkozási menedzser, amely segít a felhasználóknak átlátni étkezési szokásaikat, könnyebbé téve céljaik elérését egészségük érdekében. Az alkalmazást széles körű felhasználói réteg számára terveztük, különös tekintettel a életmódváltók és fogyni vágyók, sportolók és testépítők illetve speciális étrendet követők számára - mindezt egy reszponziv, akadálymentes, jól architekturált React | Node.js webalkalmazásként tervezve.

### 1.1. Technológiai stack

- **Frontend:** React
- **Nyelv:** Javascript
- **Styling:** SCSS + CSS custom properties (design tokenek)
- **Routing:** React Router
- **Állapotkezelés:** Zustand
- **Backend:** Node.js + Express
- **Adatbázis:** PostgreSQL
- **Autentikáció:** Firebase Authentication (email/jelszó)
- **Tárhely:** Firebase Storage (képek)
- **Hosting:** Firebase Hosting
- **Tesztelés:** Vitest (Unit) Playwright (E2E)
- **Build:** Vite
- **Verziókezelés:** Git + GitHub

---

## 2. Szerepkörök

**Admin:** Az adminisztrátor felel a rendszer integritásáért és a központi adatok kezeléséért.
- Élelmiszer-adatbázis kezelése
- Felhasználó-kezelés
- Tartalomkezelés

**Regisztrált Felhasználó:** Ez a szerepkör az alkalmazás elsődleges célcsoportja. Az interakció a saját adatok bevitelére és a fejlődés nyomon követésére fókuszál.
- Adatbevitel
- Személyre szabás
- Saját adatbázis építése (Kedvenc ételek és receptek mentése a gyorsabb rögzítéshez)
- Vizuális visszacsatolás (pl. grafikon)

---

## 3. Funkcionális követelmények

1. Regisztráció és profilalkotás: A felhasználó regisztrálhat e-maillel és jelszóval. Az első belépéskor megadhatja fizikai adatait (kor, nem, súly, magasság) és aktivitási szintjét a napi kalóriakeret meghatározásához.
2. Hitelesítés: A felhasználó bejelentkezhet a Firebase Authentication segítségével, és hozzáférhet a védett útvonalakhoz.
3. Élelmiszer-adatbázis kezelése: A felhasználó kereshet az alapértelmezett élelmiszerek között, és új, saját élelmiszereket (név, kalória, makrotápanyagok: fehérje, szénhidrát, zsír) rögzíthet.
4. Napi napló (Logging): A felhasználó rögzítheti az elfogyasztott ételeket és azok mennyiségét a napi naplójában, étkezési típusok szerinti bontásban (reggeli, ebéd, vacsora, snack).
5. Célkitűzés és haladás: A rendszer a megadott adatok alapján kiszámítja a napi ajánlott makrotápanyag-bevitelt, és vizuálisan (pl. progress bar) megjeleníti az aktuális napi egyenleget.
6. Speciális étrend jelölők: A felhasználó beállíthat diétás preferenciákat (pl. vegán, gluténmentes, laktózmentes), a rendszer pedig szűrhetővé teszi az élelmiszereket ezek alapján.
7. Adatmódosítás és törlés: A felhasználó szerkesztheti vagy törölheti a naplójába korábban felvitt bejegyzéseket.
8. Adminisztrációs felület: Az admin jogosultsággal rendelkező felhasználók globális élelmiszer-kategóriákat hozhatnak létre, és moderálhatják a közösségi adatbázisba feltöltött elemeket.

---

## 4. Nem-funkcionális követelmények

1. Biztonság: A felhasználói hitelesítés és a jelszavak kezelése a Firebase Authentication biztonságos protokolljain keresztül történik. Az adatbázis-hozzáférés biztonsági szabályokkal (Firebase/PostgreSQL policy) védett.
2. Állapotkezelés: Az alkalmazás kliensoldali állapota (pl. aktuális napi adatok, felhasználói beállítások) a Zustand könyvtárral kerül kezelésre az optimális teljesítmény érdekében.
3. Reszponzivitás: A felületnek SCSS és CSS custom properties használatával teljesen reszponzívnak kell lennie, kiszolgálva a mobil, tablet és desktop nézeteket is.
4. Adatkonzisztencia: A PostgreSQL adatbázisnak biztosítania kell a relációs integritást a felhasználók, az elfogyasztott ételek és az élelmiszer-törzsadatok között.
5. Teljesítmény: Az oldal betöltési idejének (LCP) 2 másodperc alatt kell maradnia, amelyet a Vite build-optimalizálása és a kód szétválasztása (code-splitting) segít.
6. Karbantarthatóság: A forráskódot moduláris felépítésben, tiszta architektúra elveit követve kell tárolni a GitHubon, dokumentált komponensstruktúrával.
7. Teszteltség: A kritikus üzleti logika (pl. kalória-számítás) unit tesztekkel (Vitest), a kritikus felhasználói folyamatok (pl. regisztráció, étel rögzítése) pedig E2E tesztekkel (Playwright) ellenőrzöttek.
8. Akadálymentesség: A UI elemeknek meg kell felelniük az alapvető akadálymentességi (A11y) irányelveknek (megfelelő kontrasztarány, fókuszkezelés, leíró címkék).

---

## 5. Kliens oldali nézetek

Az React alkalmazás az alábbi fő nézeteket (oldalakat) tartalmazza:

### 5.1. Nyilvános nézetek

- **Kezdőlap** – Motivacio, Feature lista, Celok
- **Bejelentkezés** – E-mail és jelszó megadása
- **Regisztráció** – Új fiók létrehozása

### 5.2. Bejelentkezett felhasználói nézetek

- **Főoldal** – Az összesítő modulok gyűjtőhelye
- **Napló és Keresés** – Részletes napi lista az elfogyasztott ételekről
- **Fejlődés követése** – Elemzések gyűjtőoldala
- **Beállítások** –  Beállítások központja


### 5.3. Admin nézetek

- **Kategória kezelés** – CRUD műveletek kategóriákra
- **Recept kezelés** – CRUD műveletek receptekre és hozzávalókra
- **Értékelés moderálás** – Értékelések áttekintése és törlése

---

## 6. Telepítés és futtatás

A rendszer minden komponense konténerizált formában lesz üzemeltetve. A rendszer futtatásához szükséges előfeltételek:

- Node.js (v24)
- PostgreSQL (lokális)
- Firebase CLI (v21)

---

## 7. Mappaszerkezet

A GitHub repository várt struktúrája:

| Mappa / Fájl | Leírás |
|---|---|
| `/server` | Express.js szerver forráskód |
| `/client` | React alkalmazás forráskód |
| `/docs` | Dokumentáció (ez a specifikáció is) |
| `/prompts` | AI prompt-ok és elemzés |
| `README.md` | Telepítési útmutató |
