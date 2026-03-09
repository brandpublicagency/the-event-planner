
import React from "react";

export const MinCharactersNotice: React.FC = () => {
  return (
    <div className="absolute top-full mt-1 w-full bg-popover rounded-md border border-border shadow-md z-10">
      <div className="p-3 text-sm text-muted-foreground text-center">
        Type at least 2 characters to search
      </div>
    </div>
  );
};
