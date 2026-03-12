
import { useLocation } from "react-router-dom";

export function useSidebarGradient() {
  const location = useLocation();
  
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard-2':
        return 'bg-gradient-to-br from-[hsl(210,50%,93%)] via-[hsl(220,42%,95%)] to-[hsl(200,46%,92%)]';
      case '/events':
        return 'bg-gradient-to-br from-[hsl(140,26%,92%)] via-[hsl(150,22%,94%)] to-[hsl(160,26%,91%)]';
      case '/events/passed':
        return 'bg-gradient-to-br from-[hsl(270,30%,93%)] via-[hsl(280,25%,95%)] to-[hsl(290,30%,92%)]';
      case '/calendar':
        return 'bg-gradient-to-br from-[hsl(15,50%,93%)] via-[hsl(20,44%,95%)] to-[hsl(10,40%,92%)]';
      case '/tasks':
        return 'bg-gradient-to-br from-[hsl(30,44%,93%)] via-[hsl(25,38%,95%)] to-[hsl(35,44%,92%)]';
      case '/contacts':
        return 'bg-gradient-to-br from-[hsl(25,40%,93%)] via-[hsl(30,36%,95%)] to-[hsl(35,40%,92%)]';
      case '/documents':
        return 'bg-gradient-to-br from-[hsl(195,38%,93%)] via-[hsl(200,32%,95%)] to-[hsl(210,38%,92%)]';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-[hsl(260,34%,93%)] via-[hsl(250,28%,95%)] to-[hsl(270,34%,92%)]';
      default:
        return 'bg-gradient-to-br from-[hsl(30,18%,95%)] via-[hsl(25,12%,96%)] to-[hsl(35,18%,94%)]';
    }
  };

  return { getGradientByPath };
}
