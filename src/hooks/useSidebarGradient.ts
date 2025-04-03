
import { useLocation } from "react-router-dom";

export function useSidebarGradient() {
  const location = useLocation();
  
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50/80 to-sky-100 backdrop-blur-sm border-r border-blue-100/50';
      case '/events':
        return 'bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-100 backdrop-blur-sm border-r border-emerald-100/50';
      case '/passed-events':
        return 'bg-gradient-to-br from-violet-50 via-purple-50/80 to-fuchsia-100 backdrop-blur-sm border-r border-violet-100/50';
      case '/calendar':
        return 'bg-gradient-to-br from-rose-50 via-pink-50/80 to-red-100 backdrop-blur-sm border-r border-rose-100/50';
      case '/tasks':
        return 'bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-100 backdrop-blur-sm border-r border-amber-100/50';
      case '/contacts':
        return 'bg-gradient-to-br from-orange-50 via-orange-50/80 to-amber-100 backdrop-blur-sm border-r border-orange-100/50';
      case '/documents':
        return 'bg-gradient-to-br from-cyan-50 via-sky-50/80 to-blue-100 backdrop-blur-sm border-r border-cyan-100/50';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-purple-50 via-indigo-50/80 to-violet-100 backdrop-blur-sm border-r border-purple-100/50';
      case '/my-business':
        return 'bg-gradient-to-br from-indigo-50 via-blue-50/80 to-purple-100 backdrop-blur-sm border-r border-indigo-100/50';
      default:
        return 'bg-gradient-to-br from-slate-50 via-gray-50/80 to-slate-100 backdrop-blur-sm border-r border-slate-100/50';
    }
  };

  return { getGradientByPath };
}
