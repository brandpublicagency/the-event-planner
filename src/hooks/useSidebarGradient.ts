
import { useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

export function useSidebarGradient() {
  const location = useLocation();
  const { theme } = useTheme();

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const getGradientByPath = () => {
    if (isDark) {
      switch (location.pathname) {
        case '/':
          return 'bg-gradient-to-br from-[hsl(210,15%,9%)] via-[hsl(330,10%,9%)] to-[hsl(190,12%,8%)]';
        case '/events':
          return 'bg-gradient-to-br from-[hsl(145,12%,9%)] via-[hsl(155,10%,9%)] to-[hsl(140,10%,8%)]';
        case '/events/passed':
          return 'bg-gradient-to-br from-[hsl(275,12%,9%)] via-[hsl(285,10%,9%)] to-[hsl(270,10%,8%)]';
        case '/calendar':
          return 'bg-gradient-to-br from-[hsl(15,15%,9%)] via-[hsl(20,12%,9%)] to-[hsl(10,12%,8%)]';
        case '/tasks':
          return 'bg-gradient-to-br from-[hsl(30,12%,9%)] via-[hsl(25,10%,9%)] to-[hsl(35,10%,8%)]';
        case '/contacts':
          return 'bg-gradient-to-br from-[hsl(20,12%,9%)] via-[hsl(25,10%,9%)] to-[hsl(15,10%,8%)]';
        case '/documents':
          return 'bg-gradient-to-br from-[hsl(195,12%,9%)] via-[hsl(200,10%,9%)] to-[hsl(190,10%,8%)]';
        case '/schedule/meeting':
        case '/schedule/site-visit':
          return 'bg-gradient-to-br from-[hsl(260,12%,9%)] via-[hsl(250,10%,9%)] to-[hsl(270,10%,8%)]';
        default:
          return 'bg-gradient-to-br from-[hsl(14,15%,9%)] via-[hsl(20,12%,9%)] to-[hsl(8,12%,8%)]';
      }
    }

    switch (location.pathname) {
      case '/':
        return 'bg-gradient-to-br from-[hsl(210,55%,90%)] via-[hsl(330,45%,92%)] to-[hsl(190,48%,88%)]';
      case '/events':
        return 'bg-gradient-to-br from-[hsl(145,35%,88%)] via-[hsl(155,30%,90%)] to-[hsl(140,32%,86%)]';
      case '/events/passed':
        return 'bg-gradient-to-br from-[hsl(275,38%,90%)] via-[hsl(285,32%,92%)] to-[hsl(270,36%,88%)]';
      case '/calendar':
        return 'bg-gradient-to-br from-[hsl(15,60%,90%)] via-[hsl(20,55%,92%)] to-[hsl(10,50%,88%)]';
      case '/tasks':
        return 'bg-gradient-to-br from-[hsl(30,55%,89%)] via-[hsl(25,48%,91%)] to-[hsl(35,52%,87%)]';
      case '/contacts':
        return 'bg-gradient-to-br from-[hsl(20,50%,89%)] via-[hsl(25,45%,91%)] to-[hsl(15,48%,87%)]';
      case '/documents':
        return 'bg-gradient-to-br from-[hsl(195,45%,89%)] via-[hsl(200,40%,91%)] to-[hsl(190,42%,87%)]';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-[hsl(260,40%,90%)] via-[hsl(250,35%,92%)] to-[hsl(270,38%,88%)]';
      default:
        return 'bg-gradient-to-br from-[hsl(14,65%,88%)] via-[hsl(20,60%,90%)] to-[hsl(8,58%,85%)]';
    }
  };

  return { getGradientByPath };
}
