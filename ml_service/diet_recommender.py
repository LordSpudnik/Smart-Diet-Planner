import pandas as pd
import numpy as np

def calculate_tdee(age, weight_kg, height_cm, activity_level, goal):
    """
    Calculates the Total Daily Energy Expenditure (TDEE) for a user.
    """
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    activity_multipliers = {
        "sedentary": 1.2, "light": 1.375, "moderate": 1.55,
        "active": 1.725, "very_active": 1.9,
    }
    tdee = bmr * activity_multipliers.get(activity_level, 1.55)
    goal_adjustments = {"weight_loss": -500, "maintenance": 0, "weight_gain": 500}
    tdee += goal_adjustments.get(goal, 0)
    return tdee

def filter_whole_foods(df):
    """
    Filters the DataFrame to exclude processed and composite foods.
    """
    blocklist = [
        'spread', 'sauce', 'dressing', 'powder', 'canned', 'juice',
        'syrup', 'cereal', 'bar', 'chips', 'cookie', 'cracker', 'infant',
        'formula', 'toddler', 'beverage', 'shake', 'soup', 'cnd', 'usda'
    ]
    mask = df['Food'].str.contains('|'.join(blocklist), case=False, na=False)
    filtered_df = df[~mask]
    print(f"After whole foods filter: {len(filtered_df)} foods remaining.")
    return filtered_df

def filter_dietary_preference(df, preference):
    """
    Filters the DataFrame based on veg or non-veg preference.
    """
    if preference.lower() == 'veg':
        # Keywords to identify non-vegetarian food
        non_veg_keywords = [
            'beef', 'pork', 'lamb', 'chicken', 'turkey', 'fish', 'salmon',
            'tuna', 'shrimp', 'crab', 'lobster', 'bacon', 'sausage', 'ham',
            'meat', 'poultry', 'seafood', 'veal', 'mutton'
        ]
        mask = df['Food'].str.contains('|'.join(non_veg_keywords), case=False, na=False)
        filtered_df = df[~mask]
        print(f"After '{preference}' filter: {len(filtered_df)} foods remaining.")
        return filtered_df
    # If preference is 'non-veg', no items need to be removed.
    return df


def recommend_diet(tdee, dietary_preference="non-veg", dataset_path="nutrition.csv"):
    """
    Generates a daily diet plan based on TDEE and dietary preference.
    """
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Error: The dataset file '{dataset_path}' was not found.")
        return None

    required_cols = {
        'food': 'Food', 'Caloric Value': 'Calories', 'Protein': 'Protein',
        'Carbohydrates': 'Carbs', 'Fat': 'Fat'
    }

    if not all(col in df.columns for col in required_cols.keys()):
        print("Error: The CSV file is missing required columns.")
        return None

    df = df[list(required_cols.keys())].rename(columns=required_cols)
    df = df.dropna()
    for col in ['Calories', 'Protein', 'Carbs', 'Fat']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df = df.dropna()
    df = df[df['Calories'] > 0]
    print(f"Original dataset size: {len(df)} foods.")

    # --- APPLY FILTERS ---
    df = filter_whole_foods(df)
    df = filter_dietary_preference(df, dietary_preference)

    meal_calorie_targets = {
        "Breakfast": tdee * 0.25, "Lunch": tdee * 0.35,
        "Dinner": tdee * 0.30, "Snack": tdee * 0.10,
    }

    diet_plan = []
    
    for meal, meal_target_calories in meal_calorie_targets.items():
        possible_foods = df[
            (df['Calories'] > meal_target_calories * 0.6) & 
            (df['Calories'] < meal_target_calories * 1.4)
        ]
        
        if not possible_foods.empty:
            food_item = possible_foods.sample(n=1).iloc[0]
            diet_plan.append({
                'Meal': meal,
                'Food': food_item['Food'].strip().capitalize(),
                'Calories': food_item['Calories'],
                'Protein (g)': food_item['Protein'],
                'Carbs (g)': food_item['Carbs'],
                'Fat (g)': food_item['Fat']
            })

    if not diet_plan:
        print("Could not generate a full diet plan. Consider adjusting filters or checking the dataset.")
        return None

    plan_df = pd.DataFrame(diet_plan)
    summary = {
        'Meal': 'Total', 'Food': '', 'Calories': plan_df['Calories'].sum(),
        'Protein (g)': round(plan_df['Protein (g)'].sum(), 2),
        'Carbs (g)': round(plan_df['Carbs (g)'].sum(), 2),
        'Fat (g)': round(plan_df['Fat (g)'].sum(), 2)
    }
    summary_df = pd.DataFrame([summary])
    final_plan_df = pd.concat([plan_df, summary_df], ignore_index=True)

    return final_plan_df

if __name__ == "__main__":
    user_profile = {
        "age": 20, "weight_kg": 70, "height_cm": 175,
        "activity_level": "moderate", "goal": "maintenance",
        "dietary_preference": "veg"
    }

    print("Generating diet plan for user profile:")
    print(user_profile)

    user_tdee = calculate_tdee(
        age=user_profile["age"],
        weight_kg=user_profile["weight_kg"],
        height_cm=user_profile["height_cm"],
        activity_level=user_profile["activity_level"],
        goal=user_profile["goal"]
    )
    print(f"\nTarget Daily Calories (TDEE): {round(user_tdee, 2)} kcal\n")

    diet_recommendation = recommend_diet(
        user_tdee, 
        dietary_preference=user_profile["dietary_preference"]
    )

    if diet_recommendation is not None:
        output_filename = "diet_plan.csv"
        diet_recommendation.to_csv(output_filename, index=False)
        print("\n--- Generated Diet Plan ---")
        print(diet_recommendation.to_string())
        print("---------------------------")
        print(f"\n✅ Plan successfully saved to '{output_filename}'")