import sys
import argparse
import json
import pandas as pd
import numpy as np
from datetime import datetime
import os


def calculate_tdee(age, weight_kg, height_cm, activity_level, goal):
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    tdee = bmr * activity_multipliers.get(activity_level, 1.55)
    goal_adjustments = {"weight_loss": -500, "maintenance": 0, "weight_gain": 500}
    tdee += goal_adjustments.get(goal, 0)
    return tdee


def filter_whole_foods(df):
    blocklist = [
        "spread",
        "sauce",
        "dressing",
        "powder",
        "canned",
        "juice",
        "syrup",
        "cereal",
        "bar",
        "chips",
        "cookie",
        "cracker",
        "infant",
        "formula",
        "toddler",
        "beverage",
        "shake",
        "soup",
        "cnd",
        "usda",
        "flour",
        "raw",
    ]
    mask = df["Food"].str.contains("|".join(blocklist), case=False, na=False)
    return df[~mask]


def filter_dietary_preference(df, preference):
    if preference.lower() == "veg":
        non_veg_keywords = [
            "beef",
            "pork",
            "lamb",
            "chicken",
            "turkey",
            "fish",
            "salmon",
            "tuna",
            "shrimp",
            "crab",
            "lobster",
            "bacon",
            "sausage",
            "ham",
            "meat",
            "poultry",
            "seafood",
            "veal",
            "mutton",
            "duck",
            "goat",
            "gelatin",
            "anchovy",
            "sardine",
            "trout",
            "cod",
            "clam",
            "oyster",
            "scallop",
            "octopus",
            "squid",
            "venison",
            "rabbit",
            "brisket",
            "ribeye",
            "sirloin",
            "prosciutto",
            "steak",
            "emu",
            "pigeon",
            "turtle",
        ]
        mask = df["Food"].str.contains("|".join(non_veg_keywords), case=False, na=False)
        return df[~mask]
    return df


def resolve_dataset_path(dataset_path):
    """
    Ensures the nutrition.csv path resolves correctly regardless of how Python is launched.
    """
    # 1️⃣ if an absolute path exists, use it
    if os.path.isabs(dataset_path) and os.path.exists(dataset_path):
        return dataset_path

    # 2️⃣ check relative to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    path_in_script_dir = os.path.join(script_dir, dataset_path)
    if os.path.exists(path_in_script_dir):
        return path_in_script_dir

    # 3️⃣ check inside a 'data' folder
    path_in_data_dir = os.path.join(script_dir, "data", dataset_path)
    if os.path.exists(path_in_data_dir):
        return path_in_data_dir

    # 4️⃣ fallback: current working directory
    cwd_path = os.path.join(os.getcwd(), dataset_path)
    if os.path.exists(cwd_path):
        return cwd_path

    # None found
    return None


def recommend_diet_from_profile(profile, dataset_path="nutrition.csv"):
    dataset_resolved = resolve_dataset_path(dataset_path)
    if not dataset_resolved or not os.path.exists(dataset_resolved):
        return None, f"Nutrition dataset not found. Please place 'nutrition.csv' in the same folder as diet_recommender.py or inside a 'data/' folder."

    age = int(profile.get("age", 25))
    weight = float(profile.get("weight", profile.get("weight_kg", 70)))
    height = float(profile.get("height", profile.get("height_cm", 175)))
    activity_level = profile.get("activityLevel", "moderate")
    goal = profile.get("dietaryGoals", "maintenance")
    dietary_pref = profile.get("dietaryPreference", "non-veg")

    tdee = calculate_tdee(age, weight, height, activity_level, goal)

    df = pd.read_csv(dataset_resolved)

    # ✅ Flexible column mapping
    lower_cols = [c.lower().strip() for c in df.columns]

    def find_col(possible):
        for name in possible:
            if name.lower() in lower_cols:
                return df.columns[lower_cols.index(name.lower())]
        return None

    food_col = find_col(["food", "name", "item"])
    cal_col = find_col(["calories", "caloric value", "energy"])
    protein_col = find_col(["protein", "proteins"])
    carbs_col = find_col(["carbs", "carbohydrates", "carbohydrate"])
    fat_col = find_col(["fat", "fats", "lipids"])

    if not all([food_col, cal_col, protein_col, carbs_col, fat_col]):
        missing = [
            n
            for n, c in zip(
                ["Food", "Calories", "Protein", "Carbs", "Fat"],
                [food_col, cal_col, protein_col, carbs_col, fat_col],
            )
            if c is None
        ]
        return None, f"CSV missing required columns: {', '.join(missing)}"

    df = df[[food_col, cal_col, protein_col, carbs_col, fat_col]].rename(
        columns={
            food_col: "Food",
            cal_col: "Calories",
            protein_col: "Protein",
            carbs_col: "Carbs",
            fat_col: "Fat",
        }
    )

    for c in ["Calories", "Protein", "Carbs", "Fat"]:
        df[c] = pd.to_numeric(df[c], errors="coerce")
    df = df.dropna()
    df = df[df["Calories"] > 0]

    df = filter_whole_foods(df)
    df = filter_dietary_preference(df, dietary_pref)

    meal_targets = {
        "Breakfast": tdee * 0.25,
        "Lunch": tdee * 0.35,
        "Dinner": tdee * 0.30,
        "Snack": tdee * 0.10,
    }

    plan = []
    for meal, target in meal_targets.items():
        possible = df[(df["Calories"] > target * 0.5) & (df["Calories"] < target * 1.5)]
        if possible.empty:
            df["diff"] = (df["Calories"] - target).abs()
            chosen = df.sort_values("diff").head(1).iloc[0]
            df.drop(columns="diff", inplace=True)
        else:
            chosen = possible.sample(1).iloc[0]

        plan.append(
            {
                "Meal": meal,
                "Food": str(chosen["Food"]).title(),
                "Calories": round(float(chosen["Calories"]), 2),
                "Protein (g)": round(float(chosen["Protein"]), 2),
                "Carbs (g)": round(float(chosen["Carbs"]), 2),
                "Fat (g)": round(float(chosen["Fat"]), 2),
            }
        )

    plan_df = pd.DataFrame(plan)
    summary = {
        "Meal": "Total",
        "Food": "",
        "Calories": plan_df["Calories"].sum(),
        "Protein (g)": round(plan_df["Protein (g)"].sum(), 2),
        "Carbs (g)": round(plan_df["Carbs (g)"].sum(), 2),
        "Fat (g)": round(plan_df["Fat (g)"].sum(), 2),
    }
    plan_df = pd.concat([plan_df, pd.DataFrame([summary])], ignore_index=True)

    csv_name = "diet_plan.csv"
    plan_df.to_csv(csv_name, index=False)

    return plan_df, csv_name


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stdin", action="store_true")
    parser.add_argument("--dataset", type=str, default=os.path.join(os.path.dirname(__file__), "nutrition.csv"))

    args = parser.parse_args()

    try:
        if args.stdin:
            profile = json.loads(sys.stdin.read())
        else:
            profile = {
                "age": 25,
                "weight": 70,
                "height": 175,
                "activityLevel": "moderate",
                "dietaryGoals": "maintenance",
                "dietaryPreference": "veg",
            }

        plan, meta = recommend_diet_from_profile(profile, args.dataset)
        if plan is None:
            print(json.dumps({"error": meta}))
            sys.exit(1)

        print(json.dumps({"plan": plan.to_dict(orient="records"), "csv_file": meta}))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
