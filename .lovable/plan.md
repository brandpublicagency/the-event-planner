

## Plan: Insert new weather widget above the greeting

The user wants to preview the new weather widget design. It uses glassmorphic cards with SVG weather icons, positioned above the greeting text.

### Changes

1. **Create `src/components/dashboard/weather/WeatherIcons.tsx`** — Extract the SVG icon components (SunIcon, MoonIcon, CloudIcon, PartlyCloudyIcon, LightRainIcon, HeavyRainIcon, ThunderIcon, SnowIcon, FogIcon) and the `getWeatherStyle` function from the uploaded `weather-preview.jsx`. Adapt to TypeScript.

2. **Replace `src/components/dashboard/weather/WeatherWidgetContent.tsx`** — Use the uploaded file directly. It renders a 6-column grid of glassmorphic `WeatherDayCard` cards (Now + 5 forecast days) with condition-based gradients and emojis. No background animations or old gradient system.

3. **Update `src/components/dashboard/DashboardLayout.tsx`** — Import `WeatherWidget` and place it directly above `<DashboardGreeting />` (line 86). Remove `DashboardWeatherCard` from the right sidebar column (line 97) since the new widget replaces it at the top.

### Result
The new weather widget grid will appear full-width above "Good afternoon, LeRoux", showing 6 glassmorphic cards (3 cols on mobile, 6 on desktop). The old sidebar weather card is removed to avoid duplication.

