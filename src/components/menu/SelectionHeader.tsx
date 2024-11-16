import React from 'react';

interface SelectionHeaderProps {
  title: string;
}

const SelectionHeader = ({ title }: SelectionHeaderProps) => {
  return <h4 className="text-sm font-medium text-zinc-500">{title}</h4>;
};

export default SelectionHeader;