import { useState, useEffect } from 'react'
import {
  searchExternalFoods,
  searchLocalFoods,
  saveFood,
} from '../api/authService'
import {
  getUserRecipes,
  searchRecipes,
  createRecipe,
} from '../api/recipeService'
import './FoodSearch.scss'

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('external')
  const [savingId, setSavingId] = useState(null)
  const [saveMessage, setSaveMessage] = useState(null)
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [recipeModalSearchQuery, setRecipeModalSearchQuery] = useState('')
  const [recipeModalResults, setRecipeModalResults] = useState([])
  const [recipeModalLoading, setRecipeModalLoading] = useState(false)
  const [recipeModalError, setRecipeModalError] = useState(null)
  const [selectedIngredients, setSelectedIngredients] = useState([])

  // Load user's foods when switching to "local" tab
  useEffect(() => {
    if (activeTab === 'local') {
      loadUserFoods()
    } else if (activeTab === 'external') {
      // Clear results when switching to external tab
      setResults([])
      setSearchQuery('')
      setError(null)
    }
  }, [activeTab])

  const loadUserFoods = async () => {
    setLoading(true)
    setError(null)
    setResults([])
    setSearchQuery('')

    try {
      const data = await getUserRecipes(100, 0)
      
      if (data.success) {
        setResults(data.results || [])
      } else {
        setError(data.message || 'Hiba a receptek betöltésekor')
      }
    } catch (err) {
      console.error('Load user recipes error:', err)
      setError('Hiba a receptek betöltésekor')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setError('A keresési kifejezésnek legalább 2 karakter hosszúnak kell lennie')
      return
    }

    setLoading(true)
    setError(null)
    setResults([])

    try {
      let data
      if (activeTab === 'external') {
        data = await searchExternalFoods(searchQuery, 1)
      } else {
        // Saját ételek - receptek keresése
        data = await searchRecipes(searchQuery)
      }

      if (data.success) {
        setResults(data.results || [])
      } else {
        setError(data.message || 'Keresési hiba')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Keresés közben hiba történt')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = async (food, index) => {
    setSavingId(index)
    setSaveMessage(null)
    
    try {
      const foodData = {
        name: food.name,
        brand: food.brand || '',
        caloriesper100g: food.calories || food.caloriesPer100g || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        barcode: food.barcode || '',
      }
      
      const result = await saveFood(foodData)
      
      if (result.success) {
        setSaveMessage({ type: 'success', text: `"${food.name}" hozzáadva az adatbázishoz!` })
      } else {
        setSaveMessage({ type: 'error', text: result.message || 'Hiba az ételt hozzáadáskor' })
      }
    } catch (err) {
      console.error('Add food error:', err)
      setSaveMessage({ type: 'error', text: 'Hiba az ételt hozzáadáskor' })
    } finally {
      setSavingId(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleModalSearch = async (e) => {
    e.preventDefault()

    if (!recipeModalSearchQuery.trim() || recipeModalSearchQuery.trim().length < 2) {
      setRecipeModalError('A keresési kifejezésnek legalább 2 karakter hosszúnak kell lennie')
      return
    }

    setRecipeModalLoading(true)
    setRecipeModalError(null)
    setRecipeModalResults([])

    try {
      const data = await searchExternalFoods(recipeModalSearchQuery, 1)
      
      if (data.success) {
        setRecipeModalResults(data.results || [])
      } else {
        setRecipeModalError(data.message || 'Keresési hiba')
      }
    } catch (err) {
      console.error('Modal search error:', err)
      setRecipeModalError('Keresés közben hiba történt')
    } finally {
      setRecipeModalLoading(false)
    }
  }

  const closeModal = () => {
    setShowCreateRecipeModal(false)
    setRecipeName('')
    setRecipeModalSearchQuery('')
    setRecipeModalResults([])
    setRecipeModalError(null)
    setSelectedIngredients([])
  }

  const handleAddIngredient = (food, index) => {
    setSelectedIngredients([...selectedIngredients, food])
  }

  const removeIngredient = (index) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index))
  }

  const calculateNutritionTotals = (ingredients) => {
    return ingredients.reduce(
      (totals, ingredient) => ({
        totalCalories: totals.totalCalories + (ingredient.calories || ingredient.caloriesPer100g || 0),
        totalProtein: totals.totalProtein + (ingredient.protein || 0),
        totalCarbs: totals.totalCarbs + (ingredient.carbs || 0),
        totalFat: totals.totalFat + (ingredient.fat || 0),
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    )
  }

  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      alert('Kérlek add meg a recept nevét!')
      return
    }

    if (selectedIngredients.length === 0) {
      alert('Kérlek válassz ki legalább egy ételt!')
      return
    }

    try {
      const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateNutritionTotals(selectedIngredients)
      
      const recipeData = {
        name: recipeName,
        description: '',
        servings: 1,
        caloriesPerServing: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
      }

      const result = await createRecipe(recipeData)

      if (result.success) {
        alert('Recept sikeresen létrehozva!')
        closeModal()
        loadUserFoods()
      } else {
        alert('Hiba a recept mentésekor: ' + result.message)
      }
    } catch (err) {
      console.error('Save recipe error:', err)
      alert('Hiba a recept mentésekor')
    }
  }

  const activeTabLabel = activeTab === 'external' ? 'Külső adatbázis' : 'Saját receptek'


  return (
    <section className="food-search-page">
      <header className="food-search-hero">
        <p className="food-search-hero__eyebrow">Élelmiszer és receptközpont</p>
        <h1 className="food-search-main-title">Food Search</h1>
        <p className="food-search-description">
          Keress külső adatbázisban vagy böngészd a saját receptjeidet egy egységes,
          gyors felületen. A részletes tápértékek segítenek tudatosabban dönteni,
          a mentési és receptépítési lehetőség pedig egyszerűsíti a napi tervezést.
        </p>
      </header>

      <div className="food-search-overview">
        <article className="food-search-overview-card">
          <p className="food-search-overview-card__label">Aktív nézet</p>
          <p className="food-search-overview-card__value">{activeTabLabel}</p>
        </article>
        <article className="food-search-overview-card">
          <p className="food-search-overview-card__label">Találatok</p>
          <p className="food-search-overview-card__value">{results.length} db</p>
        </article>
        <article className="food-search-overview-card">
          <p className="food-search-overview-card__label">Recept hozzávalók</p>
          <p className="food-search-overview-card__value">{selectedIngredients.length} db</p>
        </article>
      </div>

      <div className="food-search-container">
        <h2 className="food-search-title">Keresés</h2>

      <div className="food-search-tabs">
        <button
          className={`food-search-tab ${activeTab === 'external' ? 'active' : ''}`}
          onClick={() => setActiveTab('external')}
        >
          Külső Adatbázis
        </button>
        <button
          className={`food-search-tab ${activeTab === 'local' ? 'active' : ''}`}
          onClick={() => setActiveTab('local')}
        >
          Saját Ételek
        </button>
      </div>

      <form onSubmit={handleSearch} className="food-search-form">
        <input
          type="text"
          placeholder={activeTab === 'external' ? 'Keress élelmiszerekre...' : 'Keress a saját ételeid között...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="food-search-input"
        />
        <button type="submit" className="food-search-button" disabled={loading}>
          {loading ? 'Keresés...' : 'Keresés'}
        </button>
      </form>

      {error && <div className="food-search-error">{error}</div>}

      {loading && <div className="food-search-loading">Keresés folyamatban...</div>}

      {!loading && results.length > 0 && (
        <div className="food-search-results">
          <h3 className="food-search-results-title">
            Eredmények ({results.length} db)
          </h3>
          {saveMessage && (
            <div className={`food-search-message ${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}
          <div className="food-search-items">
            {results.map((item, index) => (
              activeTab === 'external' ? (
                <div key={index} className="food-search-item">
                  <div className="food-search-item-content">
                    <h4 className="food-search-item-name">{item.name}</h4>
                    {item.brand && (
                      <p className="food-search-item-brand">{item.brand}</p>
                    )}
                    <div className="food-search-item-nutrition">
                      <span className="food-search-nutrition-item">
                        🔥 {item.calories || item.caloriesPer100g || 0} kcal/100g
                      </span>
                      {(item.protein || item.protein) && (
                        <span className="food-search-nutrition-item">
                          🥚 {item.protein || 0}g fehérje
                        </span>
                      )}
                      {(item.carbs || item.carbs) && (
                        <span className="food-search-nutrition-item">
                          🍞 {item.carbs || 0}g szénhidrát
                        </span>
                      )}
                      {(item.fat || item.fat) && (
                        <span className="food-search-nutrition-item">
                          🧈 {item.fat || 0}g zsír
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="food-search-item-actions">
                    <button 
                      className="food-search-add-btn"
                      onClick={() => handleAddFood(item, index)}
                      disabled={savingId === index}
                    >
                      {savingId === index ? 'Hozzáadás...' : '➕ Hozzáadás'}
                    </button>
                  </div>
                </div>
              ) : (
                <div key={index} className="food-search-item recipe-item">
                  <div className="food-search-item-content">
                    <h4 className="food-search-item-name">{item.name}</h4>
                    {item.description && (
                      <p className="recipe-description">{item.description}</p>
                    )}
                    <div className="recipe-details">
                      {item.servings && (
                        <span className="recipe-detail">🍽️ {item.servings} adag</span>
                      )}
                      {item.caloriesPerServing && (
                        <span className="recipe-detail">🔥 {item.caloriesPerServing} kcal/adag</span>
                      )}
                      {item.protein && (
                        <span className="recipe-detail">🥚 {item.protein}g fehérje</span>
                      )}
                      {item.carbs && (
                        <span className="recipe-detail">🍞 {item.carbs}g szénhidrát</span>
                      )}
                      {item.fat && (
                        <span className="recipe-detail">🧈 {item.fat}g zsír</span>
                      )}
                    </div>
                  </div>
                  <div className="food-search-item-actions">
                    <button className="recipe-view-btn">
                      👁️ Megtekintés
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === 'external' && searchQuery && results.length === 0 && !error && (
        <div className="food-search-no-results">Nincs találat a keresésre</div>
      )}

      {!loading && activeTab === 'local' && results.length === 0 && !error && (
        <div className="food-search-empty-recipes">
          <p className="food-search-empty-recipes-text">Még nincs saját recepted</p>
          <button className="food-search-create-btn" onClick={() => setShowCreateRecipeModal(true)}>
            + Recept létrehozása
          </button>
        </div>
      )}

      {showCreateRecipeModal && (
        <div className="recipe-modal-overlay">
          <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="recipe-modal-header">
              <h2>Új Recept Létrehozása</h2>
              <button className="recipe-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="recipe-modal-content">
              <div className="recipe-name-form">
                <label htmlFor="recipe-name" className="recipe-name-label">Recept neve</label>
                <input
                  id="recipe-name"
                  type="text"
                  placeholder="Add meg a recept nevét..."
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="recipe-name-input"
                />
              </div>

              <p className="recipe-modal-description">Keress élelmiszerekre, hogy hozzáadhasd őket a receptedhez</p>

              <form onSubmit={handleModalSearch} className="recipe-modal-search-form">
                <input
                  type="text"
                  placeholder="Keress élelmiszerekre..."
                  value={recipeModalSearchQuery}
                  onChange={(e) => setRecipeModalSearchQuery(e.target.value)}
                  className="recipe-modal-search-input"
                />
                <button type="submit" className="recipe-modal-search-btn" disabled={recipeModalLoading}>
                  {recipeModalLoading ? 'Keresés...' : 'Keresés'}
                </button>
              </form>

              {recipeModalError && <div className="recipe-modal-error">{recipeModalError}</div>}

              {recipeModalLoading && <div className="recipe-modal-loading">Keresés folyamatban...</div>}

              {!recipeModalLoading && recipeModalResults.length > 0 && (
                <div className="recipe-modal-results">
                  <h3 className="recipe-modal-results-title">Keresési Eredmények ({recipeModalResults.length} db)</h3>
                  <div className="recipe-modal-items">
                    {recipeModalResults.map((food, index) => (
                      <div key={index} className="recipe-modal-item">
                        <div className="recipe-modal-item-content">
                          <h4 className="recipe-modal-item-name">{food.name}</h4>
                          {food.brand && <p className="recipe-modal-item-brand">{food.brand}</p>}
                          <div className="recipe-modal-item-nutrition">
                            <span>🔥 {food.calories || food.caloriesPer100g || 0} kcal/100g</span>
                            <span>🥚 {food.protein || 0}g fehérje</span>
                            <span>🍞 {food.carbs || 0}g szénhidrát</span>
                            <span>🧈 {food.fat || 0}g zsír</span>
                          </div>
                        </div>
                        <button 
                          className="recipe-modal-item-add-btn"
                          onClick={() => handleAddIngredient(food, index)}
                          type="button"
                        >
                          ➕ Hozzáadás
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!recipeModalLoading && recipeModalSearchQuery && recipeModalResults.length === 0 && !recipeModalError && (
                <div className="recipe-modal-no-results">Nincs találat a keresésre</div>
              )}

              {selectedIngredients.length > 0 && (
                <div className="recipe-modal-selected">
                  <h3 className="recipe-modal-selected-title">Kiválasztott Ételek ({selectedIngredients.length} db)</h3>
                  <div className="recipe-modal-selected-items">
                    {selectedIngredients.map((ingredient, index) => (
                      <div key={index} className="recipe-modal-selected-item">
                        <div className="recipe-modal-selected-item-info">
                          <h5 className="recipe-modal-selected-item-name">{ingredient.name}</h5>
                          <span className="recipe-modal-selected-item-cals">
                            🔥 {ingredient.calories || ingredient.caloriesPer100g || 0} kcal/100g
                          </span>
                        </div>
                        <button
                          className="recipe-modal-selected-item-remove"
                          onClick={() => removeIngredient(index)}
                          type="button"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedIngredients.length > 0 && (() => {
                    const totals = calculateNutritionTotals(selectedIngredients)
                    return (
                      <div className="recipe-modal-nutrition-totals">
                        <h4>Tápértékek Összesen:</h4>
                        <div className="recipe-modal-nutrition-totals-list">
                          <span>🔥 {Math.round(totals.totalCalories)} kcal</span>
                          <span>🥚 {Math.round(totals.totalProtein * 10) / 10}g fehérje</span>
                          <span>🍞 {Math.round(totals.totalCarbs * 10) / 10}g szénhidrát</span>
                          <span>🧈 {Math.round(totals.totalFat * 10) / 10}g zsír</span>
                        </div>
                      </div>
                    )
                  })()}

                  <button className="recipe-modal-save-btn" onClick={handleSaveRecipe}>
                    💾 Recept Mentése
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </div>
    </section>
  )
}

