import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mainCourseTypes } from './MenuTypes';

interface MainCourseSectionProps {
  selectedMainCourse: string;
  onMainCourseChange: (value: string) => void;
}

const MainCourseSection = ({
  selectedMainCourse,
  onMainCourseChange,
}: MainCourseSectionProps) => {
  return (
    <div className="print:break-inside-avoid">
      <Select value={selectedMainCourse} onValueChange={onMainCourseChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select main course option" />
        </SelectTrigger>
        <SelectContent>
          {mainCourseTypes.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label} - R {option.price.toFixed(2)} per person
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MainCourseSection;