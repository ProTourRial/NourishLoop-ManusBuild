# Shipaton 2026 Submission Draft — NourishLoop

> **Submission status:** The code, original dataset, mobile UI, and RevenueCat integration scaffold are prepared. The entrant must complete RevenueCat/Google Play configuration, create a launch build, publish the eligible first public version to Google Play, capture real screenshots and demo footage, and submit the final links on Devpost.

## Project summary

NourishLoop helps people make meals more satisfying without calorie counting, macro tracking, or restrictive plans. Rather than assigning targets or judging food choices, it begins with a short real-life check-in: hunger, energy, available time, preferred food feeling, ingredients on hand, and dietary preferences. It responds with a flexible, practical meal idea with substitutions and calm encouragement.

The app is designed for moments when deciding what to eat feels disproportionately difficult. A five-minute snack can be just as supported as a thirty-minute meal. Users can save ideas that work for them, so the next decision gets lighter over time.

## Features and functionality

| Feature | How it works |
|---|---|
| Real-life check-in | Four quick inputs capture hunger, energy, realistic time, and desired food mood; ingredients and dietary preferences are optional. |
| Explainable recommendation engine | A typed API ranks original meal templates using a deterministic fit score and returns the best idea, the reason it fits, and a supportive nudge. |
| Flexible meal cards | Each result gives a simple balance of components, preparation steps, and substitutions instead of fixed rules. |
| Saved calm corner | Helpful ideas can be saved locally and revisited later. |
| NourishLoop Plus | The subscription experience is designed to unlock unlimited ideas, expanded substitutions, and gentle weekly collections through RevenueCat. |

## Nutrition & Healthy Eating Influencer Award description

NourishLoop gives people practical nutrition support without reducing food to numbers. Every interaction starts with the question, **“What would feel good right now?”** rather than a calorie budget or a rule to follow. The recommendation engine responds to everyday constraints—time, energy, hunger, mood, and available ingredients—then offers a meal structure that users can adapt.

The experience is compassionate by design. It does not use calorie counts, macro targets, weigh-ins, streak penalties, or restrictive meal plans. Its supportive language and substitution-first structure aim to make nourishing food feel possible in ordinary, imperfect moments.

## RevenueCat Design Award description

NourishLoop uses a warm Oat background, calm Evergreen action color, Sage Mist supporting surfaces, and Peach moments of encouragement. The layout follows a one-handed mobile hierarchy with large reachable controls, concise choice chips, and a low-friction flow from check-in to result. The app’s visual language avoids clinical diet aesthetics in favor of soft cards, practical language, and quiet feedback.

The Plus paywall extends that same design intent: the subscription is framed as **more support, never more pressure**. It clearly explains the value of premium access, supports restoration, and is prepared to render live offerings through RevenueCat rather than relying on hardcoded prices.

## RevenueCat Peace Prize description

NourishLoop aims to reduce the friction and shame that can make everyday eating harder. It offers a practical way for people with limited time, varying energy, and imperfect ingredients to find a next meal without punitive tracking. The app is inclusive of dietary preferences, prioritizes affordable pantry-friendly ideas, and makes substitutions a first-class part of every recommendation.

## HAMM Award description

The free experience proves value through a fast daily check-in and one useful meal idea. NourishLoop Plus monetizes depth rather than restriction: unlimited personalized ideas, expanded substitutions, and weekly collections that reduce planning fatigue. RevenueCat controls entitlements and current offerings, enabling product/pricing iteration without hardcoding price data in the mobile client.

## Required submission assets

| Requirement | Prepared in repository | Entrant action before submission |
|---|---|---|
| Working Android application | Yes | Build and publish the first public Google Play version during the submission period. |
| RevenueCat purchase flow | SDK and UI ready | Create entitlement/offering/products and configure the Android public SDK key. |
| Project description | Yes, this file | Paste the project summary and appropriate category descriptions into Devpost. |
| Demonstration video under two minutes | Storyboard below | Record real on-device footage and upload it publicly to YouTube or Vimeo. |
| 1024×1024 app icon | `assets/images/icon.png` | Use it in the store listing and Devpost. |
| 1179×2556 screenshot without device frame | App screens are ready | Capture real app screens on a compatible device or create approved store screenshots from a launch build. |
| Judge access | Paywall flow prepared | Provide a free trial or eligible promo code after products are live. |

## Two-minute demo storyboard

| Time | On-screen demonstration | Narration direction |
|---|---|---|
| 0:00–0:12 | Today screen and the “Find my next meal” action | Introduce NourishLoop as flexible food support without counting. |
| 0:12–0:37 | Complete Quick Check-in with realistic time, hunger, mood, and ingredients | Show how the app meets a user where they are. |
| 0:37–1:12 | Reveal a recommendation and scroll components, steps, substitutions, and the fit reason | Explain that every option is practical and adaptable. |
| 1:12–1:28 | Save an idea, open Saved Ideas, then re-open it | Show how useful choices stay accessible on later days. |
| 1:28–1:50 | Visit Profile and the Plus paywall, then show an active test entitlement if configured | Explain premium support and RevenueCat-powered subscription access. |
| 1:50–2:00 | Return to Today screen | Restate the project’s compassionate, non-restrictive mission. |

## Testing instructions for judges

Open NourishLoop, choose **Find my next meal**, select the check-in options, and choose **Create my meal idea**. Review the returned meal, substitutions, and match explanation. Save it with the bookmark button and verify it appears in **Saved**. Open **Profile → Explore Plus** to inspect the monetization flow. After the live store configuration is complete, use the supplied trial or promo code to unlock Plus and verify the `nourishloop_plus` entitlement.
