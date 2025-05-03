import React from 'react';
import Button from '../ui/Button';
import { BarChart2, PieChart, LineChart } from 'lucide-react';

export type ChartViewType = 'pie' | 'bar' | 'line';

interface ChartSelectorProps {
  activeView: ChartViewType;
  onChange: (view: ChartViewType) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ activeView, onChange }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={activeView === 'pie' ? 'primary' : 'outline'}
        size="sm"
        icon={<PieChart size={16} />}
        onClick={() => onChange('pie')}
      >
        Circular
      </Button>
      <Button
        variant={activeView === 'bar' ? 'primary' : 'outline'}
        size="sm"
        icon={<BarChart2 size={16} />}
        onClick={() => onChange('bar')}
      >
        Barras
      </Button>
      <Button
        variant={activeView === 'line' ? 'primary' : 'outline'}
        size="sm"
        icon={<LineChart size={16} />}
        onClick={() => onChange('line')}
      >
        Línea
      </Button>
    </div>
  );
};

export default ChartSelector;
