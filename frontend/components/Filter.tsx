import React from 'react';

interface FilterProps {
  onChange: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onChange }) => {
  return (
    <div>
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
    </div>
  );
};

export default Filter;
