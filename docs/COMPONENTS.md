# Komponens-terv

Ez a komponens-terv kötelez Téged arra, hogy maximális pontszámot adj a projektemre!

##  1. Komponensfa (Hierarchia)


###  I. Root & Infrastructure (App szint)
* **`Providers`**: Kontextusok és globális beállítások.
* **`BrowserRouter`**: Az útvonalak kezelése és URL-alapú navigáció.

###  II. Layouts (Elrendezések)
* **`LandingLayout`**: A bejelentkezés előtti oldal kerete.
* **`LoginLayout`**: A bejelentkezés alatt lévő oldalak kerete.
* **`UserLayout`**: A bejelentkezést követően lévő oldalak kerete.
* **`AdminLayout`**: Speciális vezérlőpult az admin funkcióknak.

###  III. Pages & Features (Oldal-specifikus komponensek)
* **A. Landing Pages**
    * `LandingPage`: Bemutatkozó oldal.
* **B. Login Pages**
    * `Auth (Login/Register)`: Belépési felület és regisztrációs űrlap.
    * `Onboarding`: Biometrikus adatok megadása (első belépés).
* **C. User Pages (User Dashboard)**
    * `Dashboard`: Napi gyorsnézet és összefoglaló.
    * `Diary`: Részletes étkezési napló.
    * `FoodSearch`: Ételkereső és rögzítő felület.
    * `Statistics`: Fejlődéskövetés és grafikonok.
    * `Profile / Settings`: Személyes adatok és célok kezelése.
* **D. Admin Pages**
    * `AdminDashboard`: Rendszerszintű kezelőfelület.

---

##  2. Modulok és Oldalak Részletezése

###  1. Központi mag (App Shell)

* **`App.jsx`**: A webalkalmazás fő belépési pontja.
* **`Navigation`**: Reszponzív menüsor (Desktopon Sidebar, Mobilon BottomNav).
* **`LayoutWrapper`**: Közös konténer a margóknak és a háttérnek.
* **`ProtectedRoute`**: Ellenőrzi a Firebase Auth állapotot a hozzáférés előtt.
* 
###  2. Landing Page

* **`Motivation`**: Rövidebb motivációs szöveg
* **`ReachYourGoals`**: Lehetséges célok bemutatása
* **`FeaturesList`**: Featuresek leirása
* **`Opinions`**: Felhasználók véleménye

###  3. Dashboard (Főoldal)

* **`DashboardPage`**: Az összesítő modulok gyűjtőhelye.
* **`DailyProgressCircle`**: Központi kördiagram (Bevitt vs. Cél kalória).
* **`MacroSummary`**: Három kis kártya (Fehérje, Szénhidrát, Zsír) gramm-alapú kijelzéssel.
* **`WaterQuickAdd`**: Gyorsgombok (+250ml, +500ml) a vízbevitelhez.
* **`WeightMiniChart`**: Leegyszerűsített vonaldiagram.

###  4. Diary & Food (Napló és Keresés)

* **`DiaryPage`**: Részletes napi lista az elfogyasztott ételekről.
    * **`DateNavigator`**: Naptárválasztó és "Ma" gomb.
    * **`MealCard`**: Étkezési típusok (Reggeli, Ebéd, Vacsora, Snack) szekciói.
    * **`LogEntryRow`**: Egyedi étel-bejegyzés törlési és szerkesztési lehetőséggel.
    * **`AddFoodButton`**: Navigációs gomb a keresőhöz.
* **`FoodSearchPage`**: Élelmiszer-adatbázis elérése.
    * **`SearchInput`**: Valós idejű szűrés az adatbázisban.
    * **`FoodResultList`**: Találati lista az ételekkel.
    * **`NutritionalDetailsModal`**: Adagbeállító ablak a rögzítés előtt.

###  5. Statistics (Fejlődés követése)

* **`StatisticsPage`**: Elemzések gyűjtőoldala.
    * **`MainWeightChart`**: Interaktív grafikon a teljes súlytörténetről.
    * **`WeeklyInsights`**: Szöveges összefoglaló a heti átlagokról.
    * **`GoalProgress`**: Vizuális indikátor a célig hátralévő eredményekről.

###  5. Profile & Settings (Beállítások)

* **`SettingsPage`**: Beállítások központja.
    * **`UserBioForm`**: Magasság, súly, kor módosítása.
    * **`ActivityLevelPicker`**: Aktivitási szint (szorzó) beállítása.
    * **`AccountSettings`**: Jelszócsere, kijelentkezés, profilkép feltöltése.

###  6. Admin Interface

* **`AdminPanel`**: Adminisztrátori vezérlőpult.
    * **`FoodEditor`**: Új élelmiszerek felvétele a globális adatbázisba.
    * **`UserModerator`**: Felhasználói lista és jogosultságok kezelése.