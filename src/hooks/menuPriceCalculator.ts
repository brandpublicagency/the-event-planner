import { MenuState } from './menuStateTypes';
import { starterTypes, mainCourseTypes, dessertTypes, otherOptions } from '@/components/menu/MenuTypes';

export const calculatePrices = (menuState: MenuState) => {
  let starterPrice = 0;
  let mainCoursePrice = 0;
  let dessertPrice = 0;
  let otherTotalPrice = 0;

  // Calculate starter price
  if (menuState.selectedStarterType) {
    const starter = starterTypes.find(s => s.value === menuState.selectedStarterType);
    if (starter) {
      starterPrice = starter.price;
    }
  }

  // Calculate main course price
  if (menuState.mainCourseType) {
    const mainCourse = mainCourseTypes.find(m => m.value === menuState.mainCourseType);
    if (mainCourse) {
      mainCoursePrice = mainCourse.price;
    }
  }

  // Calculate dessert price
  if (menuState.dessertType) {
    const dessert = dessertTypes.find(d => d.value === menuState.dessertType);
    if (dessert) {
      dessertPrice = dessert.price;
    }
  }

  // Calculate other options total
  menuState.otherSelections.forEach(selection => {
    const option = otherOptions.find(o => o.value === selection);
    if (option) {
      otherTotalPrice += option.price;
    }
  });

  return {
    starterPrice,
    mainCoursePrice,
    dessertPrice,
    otherTotalPrice
  };
};