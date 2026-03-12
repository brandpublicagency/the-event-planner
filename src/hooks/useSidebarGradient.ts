
import { useLocation } from "react-router-dom";

export function useSidebarGradient() {
  const location = useLocation();
  
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard-2':
        return 'bg-gradient-to-br from-[hsl(210,60%,92%)] via-[hsl(220,50%,94%)] to-[hsl(200,55%,90%)]';
      case '/events':
        return 'bg-gradient-to-br from-[hsl(140,30%,90%)] via-[hsl(150,25%,92%)] to-[hsl(160,30%,88%)]';
      case '/events/passed':
        return 'bg-gradient-to-br from-[hsl(270,35%,92%)] via-[hsl(280,30%,94%)] to-[hsl(290,35%,90%)]';
      case '/calendar':
        return 'bg-gradient-to-br from-[hsl(15,60%,92%)] via-[hsl(20,55%,94%)] to-[hsl(10,50%,90%)]';
      case '/tasks':
        return 'bg-gradient-to-br from-[hsl(30,55%,92%)] via-[hsl(25,50%,94%)] to-[hsl(35,55%,90%)]';
      case '/contacts':
        return 'bg-gradient-to-br from-[hsl(25,50%,92%)] via-[hsl(30,45%,94%)] to-[hsl(35,50%,90%)]';
      case '/documents':
        return 'bg-gradient-to-br from-[hsl(195,45%,92%)] via-[hsl(200,40%,94%)] to-[hsl(210,45%,90%)]';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-[hsl(260,40%,92%)] via-[hsl(250,35%,94%)] to-[hsl(270,40%,90%)]';
      default:
        return 'bg-gradient-to-br from-[hsl(30,20%,94%)] via-[hsl(25,15%,96%)] to-[hsl(35,20%,92%)]';
    }
  };

  return { getGradientByPath };
}
