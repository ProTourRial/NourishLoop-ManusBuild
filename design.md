# NourishLoop — Mobile Interface Design

NourishLoop is a compassionate daily nutrition companion for people who want satisfying meals without calorie counting, macro tracking, or restrictive plans. The application is designed for one-handed portrait use on Android (9:16), while adopting familiar iOS Human Interface Guidelines principles: clear hierarchy, generous touch targets, system-like navigation, restrained color, and immediate feedback.

## Product Direction

The core promise is: **"Feel better-fed, not more controlled."** Every recommendation is framed as a practical meal or snack idea based on hunger, energy, time, and available ingredients. The application deliberately avoids displaying calories, weight, macros, or numerical intake targets. Personalization uses a compact check-in rather than a lengthy questionnaire.

## Screen List and Functional Scope

| Screen | Primary content | Key functionality |
|---|---|---|
| Today | Greeting, daily intention, compact check-in, one featured meal idea, meal balance progress, and an upgrade entry point | Start a recommendation, view a suggestion, save an idea, and open the premium plan |
| Check-in | Hunger, energy, available time, food mood, and ingredient selection presented as large choice chips | Create a personalized recommendation request through the API |
| Recommendation | A generated food suggestion with practical components, gentle balance cues, substitutions, preparation steps, and a save action | Save the idea, request an alternative, or continue to the plan |
| Flexible Week | Three to five meal cards with a day label, fast swap action, and shopping-list entry point | Refresh the week, swap any meal idea, and open the adaptive list |
| Shopping List | Components grouped by category, individual check states, and equivalent alternatives | Check off items and adapt the list around familiar food or availability |
| Saved | A searchable-feeling, calm collection of saved meal ideas organized by moment of day | Review and remove saved recommendations persisted locally |
| Profile | Dietary choices, ingredient considerations, personal avoid list, budget preference, reminder time, and subscription status | Update preferences, schedule/cancel a gentle local reminder, and access the premium paywall |
| Premium paywall | Benefit-led comparison of Free and Plus, monthly/yearly options, restore purchase, and legal microcopy | Initiate RevenueCat purchase flow and restore entitlement |

## Primary User Flows

| Flow | Steps |
|---|---|
| Personalized meal support | Today → “Find my next meal” → Check-in selections → “Create my idea” → API returns recommendation → Save or try another suggestion |
| Flexible planning | Today → “Build a flexible week” → Weekly Plan → Swap any meal that does not fit → Build Shopping List → Check off or substitute staples |
| Gentle reminder | Profile → Enable reminder → Android permission prompt → Choose a time → Notification opens NourishLoop on the chosen daily schedule |
| Fast fallback idea | Today → Tap featured idea → Recommendation → Use substitutions or save it |
| Premium conversion | Optional support entry → Premium paywall → Select plan → RevenueCat purchase → Success confirmation → Premium status active |
| Preference control | Profile → Toggle dietary consideration / update food preferences → Save locally → Future requests carry preferences to the API |

## Layout Principles

The bottom tab bar contains **Today**, **Saved**, and **Profile** and remains reachable with one thumb. The primary action is always positioned in the lower third of the current content area without obscuring the navigation bar. Cards use 20–24 px rounded corners, compact whitespace, and concise two-line descriptions. All touch targets are at least 44 px high. Selection feedback uses subtle scale/opacity motion and haptics only on meaningful confirmations.

## Brand and Color Choices

| Token | Color | Usage |
|---|---|---|
| Evergreen | `#1F5A4C` | Primary controls, active tabs, selected states, and visual confidence |
| Sage Mist | `#DCE9DF` | Soft badges, progress surfaces, and calm supporting areas |
| Oat | `#FBF8F2` | Warm overall background that avoids clinical white |
| Peach | `#F3B284` | Accent for energy, encouragement, and food moments |
| Ink | `#21312B` | Primary text and high-contrast icons |
| Moss | `#6F8176` | Secondary text, descriptions, and disabled elements |
| Cream | `#FFFFFF` | Elevated cards and input surfaces |

## Visual Identity

The NourishLoop symbol is a simple sprouting bowl: an open, rounded bowl line supports two soft leaves in a circular rhythm. It suggests nourishment, flexibility, and an ongoing daily loop without looking medical or diet-centric. The icon fills a square 1024×1024 canvas with no embedded text and uses Evergreen, Sage Mist, Oat, and a small Peach accent.

## Content and Safety Boundaries

The app provides general food-idea inspiration only. It does not diagnose health conditions, prescribe diets, or provide calorie/macro calculations. Its language remains supportive: “You might try…”, “If it feels good today…”, and “A practical option…”.
