
import { useLocation } from "react-router-dom";

export function useSidebarGradient() {
  const location = useLocation();
  
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard-2':
        return 'bg-gradient-to-br from-[hsl(210,40%,96%)] via-[hsl(220,35%,97%)] to-[hsl(200,38%,95%)]';
      case '/events':
        return 'bg-gradient-to-br from-[hsl(140,22%,95%)] via-[hsl(150,18%,96%)] to-[hsl(160,22%,94%)]';
      case '/events/passed':
        return 'bg-gradient-to-br from-[hsl(270,25%,96%)] via-[hsl(280,20%,97%)] to-[hsl(290,25%,95%)]';
      case '/calendar':
        return 'bg-gradient-to-br from-[hsl(15,40%,96%)] via-[hsl(20,35%,97%)] to-[hsl(10,32%,95%)]';
      case '/tasks':
        return 'bg-gradient-to-br from-[hsl(30,35%,96%)] via-[hsl(25,30%,97%)] to-[hsl(35,35%,95%)]';
      case '/contacts':
        return 'bg-gradient-to-br from-[hsl(25,32%,96%)] via-[hsl(30,28%,97%)] to-[hsl(35,32%,95%)]';
      case '/documents':
        return 'bg-gradient-to-br from-[hsl(195,30%,96%)] via-[hsl(200,25%,97%)] to-[hsl(210,30%,95%)]';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-[hsl(260,28%,96%)] via-[hsl(250,22%,97%)] to-[hsl(270,28%,95%)]';
      default:
        return 'bg-gradient-to-br from-[hsl(30,15%,97%)] via-[hsl(25,10%,98%)] to-[hsl(35,15%,96%)]';
    }
  };

  return { getGradientByPath };
}
