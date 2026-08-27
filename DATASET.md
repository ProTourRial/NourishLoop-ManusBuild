# NourishLoop Starter Dataset

This repository includes an **original, hand-authored starter catalogue** of eight flexible meal and snack ideas in `shared/nourish-dataset.ts`. The dataset is created for the application and does not contain nutritional claims, calorie values, copyrighted recipes, or third-party content. Its entries encode practical attributes such as available preparation time, desired food mood, dietary compatibility, editable components, substitutions, and supportive wording.

The `nourish.recommend` API uses a deterministic scoring model. It rewards fit with the user’s selected time, hunger, energy, food mood, dietary preferences, and optionally named ingredients. This produces a testable, explainable suggestion rather than a restrictive meal plan.

| Dataset entity | Purpose | Example |
|---|---|---|
| `NourishIdea` | A flexible meal or snack template | `golden-lentil-soup` |
| `NourishCheckIn` | User-selected daily context sent to the API | `time: "fifteen", mood: "warm"` |
| `NourishRecommendation` | API response combining a best-fit idea and transparent rationale | A 15-minute warm recommendation with a gentle nudge |

## API Surface

| Procedure | Input | Output |
|---|---|---|
| `nourish.catalogue` | Optional dietary filters | All compatible meal ideas |
| `nourish.recommend` | Complete check-in selections | One ranked meal idea, match reason, and supportive nudge |

The product should be described as general food-idea support rather than medical or individualized nutritional advice.

