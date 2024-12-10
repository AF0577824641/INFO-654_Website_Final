    const APP_ID = "973ec549";
    const APP_KEY = "2c457ca678c66791e5ce97158e7322f0";

    const DAILY_VALUES = {
      totalFat: 78,
      saturatedFat: 20,
      cholesterol: 300,
      sodium: 2300,
      carbs: 275,
      fiber: 28
    };
    let currentFoods = [];
    const updateResults = (foods) => {
      const resultsBody = document.getElementById("resultsBody");
      resultsBody.innerHTML = "";

      foods.forEach((food) => {
        const foodGroup = food.tags && food.tags.food_group ? food.tags.food_group : "N/A";
        const row = `
          <tr>
            <td><img src="${food.photo.thumb}" alt="${food.food_name}" width="50" /></td>
            <td>${food.serving_qty}</td><td>${food.serving_unit}</td>
            <td><a href="#">${food.food_name}</a></td>
            <td>${food.nf_calories.toFixed(2)} kcal</td>
            <td>${food.serving_weight_grams.toFixed(2)} g</td>
            <td>${foodGroup}</td>
            <td><i class="info-icon fa fa-info-circle"></i></td>
          </tr>
        `;
        resultsBody.innerHTML += row;
      });

      document.getElementById("resultsContainer").classList.remove("hidden");
    };

  const clearResults = () => {
    document.getElementById("resultsBody").innerHTML = "";
    document.getElementById("calories").textContent = "0 kcal";
    document.getElementById("totalFat").textContent = "0 g";
    document.getElementById("totalFatDV").textContent = "0%";
    document.getElementById("saturatedFat").textContent = "0 g";
    document.getElementById("saturatedFatDV").textContent = "0%";
    document.getElementById("cholesterol").textContent = "0 mg";
    document.getElementById("cholesterolDV").textContent = "0%";
    document.getElementById("sodium").textContent = "0 mg";
    document.getElementById("sodiumDV").textContent = "0%";
    document.getElementById("carbs").textContent = "0 g";
    document.getElementById("carbsDV").textContent = "0%";
    document.getElementById("fiber").textContent = "0 g";
    document.getElementById("fiberDV").textContent = "0%";
    document.getElementById("sugars").textContent = "0 g";
    document.getElementById("protein").textContent = "0 g";
    document.getElementById("resultsContainer").classList.add("hidden");
  };

  const updateNutritionFacts = (foods, servings = 1) => {
    const totals = foods.reduce((acc, food) => {
      acc.calories += (food.nf_calories || 0) * servings;
      acc.totalFat += (food.nf_total_fat || 0) * servings;
      acc.saturatedFat += (food.nf_saturated_fat || 0) * servings;
      acc.cholesterol += (food.nf_cholesterol || 0) * servings;
      acc.sodium += (food.nf_sodium || 0) * servings;
      acc.carbs += (food.nf_total_carbohydrate || 0) * servings;
      acc.fiber += (food.nf_dietary_fiber || 0) * servings;
      return acc;
    }, {
      calories: 0,
      totalFat: 0,
      saturatedFat: 0,
      cholesterol: 0,
      sodium: 0,
      carbs: 0,
      fiber: 0
    });
    const summarizedCalories = (totals.calories / 1000).toFixed(2);
    document.getElementById("calories").textContent = `${summarizedCalories} cal`;
    document.getElementById("totalFat").textContent = `${totals.totalFat.toFixed(2)} g`;
    document.getElementById("totalFatDV").textContent = `${((totals.totalFat / DAILY_VALUES.totalFat) * 100).toFixed(2)}%`;
    document.getElementById("saturatedFat").textContent = `${totals.saturatedFat.toFixed(2)} g`;
    document.getElementById("saturatedFatDV").textContent = `${((totals.saturatedFat / DAILY_VALUES.saturatedFat) * 100).toFixed(2)}%`;
    document.getElementById("cholesterol").textContent = `${totals.cholesterol.toFixed(2)} mg`;
    document.getElementById("cholesterolDV").textContent = `${((totals.cholesterol / DAILY_VALUES.cholesterol) * 100).toFixed(2)}%`;
    document.getElementById("sodium").textContent = `${totals.sodium.toFixed(2)} mg`;
    document.getElementById("sodiumDV").textContent = `${((totals.sodium / DAILY_VALUES.sodium) * 100).toFixed(2)}%`;
    document.getElementById("carbs").textContent = `${totals.carbs.toFixed(2)} g`;
    document.getElementById("carbsDV").textContent = `${((totals.carbs / DAILY_VALUES.carbs) * 100).toFixed(2)}%`;
    document.getElementById("fiber").textContent = `${totals.fiber.toFixed(2)} g`;
    document.getElementById("fiberDV").textContent = `${((totals.fiber / DAILY_VALUES.fiber) * 100).toFixed(2)}%`;
  };
  document.getElementById("calculateBtn").addEventListener("click", () => {
    const input = document.getElementById("foodInput").value.trim();
    if (!input) {
      alert("Please enter food items.");
      return;
    }
    fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": APP_ID,
        "x-app-key": APP_KEY,
      },
      body: JSON.stringify({ query: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.foods && data.foods.length > 0) {
          currentFoods = data.foods;
          updateResults(data.foods);
          updateNutritionFacts(data.foods);
        } else {
          alert("No results found. Please try different input.");
          clearResults();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("An error occurred. Please try again.");
        clearResults();
      });
  });
  document.getElementById("servingsInput").addEventListener("input", (event) => {
    const servings = parseFloat(event.target.value);
    if (servings > 0 && currentFoods.length > 0) {
      updateNutritionFacts(currentFoods, servings);
    } else {
      clearResults();
    }
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("foodInput").value = "";
    document.getElementById("servingsInput").value = 1;
    clearResults();
  });
