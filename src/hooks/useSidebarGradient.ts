
import { useLocation } from "react-router-dom";

export function useSidebarGradient() {
  const location = useLocation();
  
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard-2':
        return 'bg-gradient-to-br from-[hsl(210,60%,85%)] via-[hsl(220,50%,88%)] to-[hsl(200,55%,82%)]';
      case '/events':
        return 'bg-gradient-to-br from-[hsl(140,30%,82%)] via-[hsl(150,25%,85%)] to-[hsl(160,30%,80%)]';
      case '/events/passed':
        return 'bg-gradient-to-br from-[hsl(270,35%,85%)] via-[hsl(280,30%,88%)] to-[hsl(290,35%,83%)]';
      case '/calendar':
        return 'bg-gradient-to-br from-[hsl(15,60%,85%)] via-[hsl(20,55%,88%)] to-[hsl(10,50%,82%)]';
      case '/tasks':
        return 'bg-gradient-to-br from-[hsl(30,55%,85%)] via-[hsl(25,50%,88%)] to-[hsl(35,55%,82%)]';
      case '/contacts':
        return 'bg-gradient-to-br from-[hsl(25,50%,84%)] via-[hsl(30,45%,87%)] to-[hsl(35,50%,82%)]';
      case '/documents':
        return 'bg-gradient-to-br from-[hsl(195,45%,84%)] via-[hsl(200,40%,87%)] to-[hsl(210,45%,82%)]';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-[hsl(260,40%,85%)] via-[hsl(250,35%,88%)] to-[hsl(270,40%,83%)]';
      default:
        return 'bg-gradient-to-br from-[hsl(30,20%,88%)] via-[hsl(25,15%,90%)] to-[hsl(35,20%,86%)]';
    }
  };

  return { getGradientByPath };
}
