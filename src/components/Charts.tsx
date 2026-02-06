import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const COLORS = {
  light: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
  dark: ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee', '#a3e635'],
};

interface PieChartData {
  name: string;
  value: number;
}

interface BarChartData {
  name: string;
  income: number;
  expense: number;
}

interface LineChartData {
  date: string;
  value: number;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  const { resolvedTheme } = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg shadow-xl text-sm ${
        resolvedTheme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
      }`}>
        {label && <p className="font-medium mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="font-bold">
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString('ar-SA') + ' ر.س'
                : entry.value
              }
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Pie Chart Component
export function ExpensePieChart({ data }: { data: PieChartData[] }) {
  const { resolvedTheme } = useTheme();
  const colors = COLORS[resolvedTheme];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Bar Chart Component
export function IncomeExpenseBarChart({ data }: { data: BarChartData[] }) {
  const { resolvedTheme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}
        />
        <XAxis 
          dataKey="name" 
          tick={{ fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
          axisLine={{ stroke: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0' }}
        />
        <YAxis 
          tick={{ fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
          axisLine={{ stroke: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0' }}
          tickFormatter={(value) => value.toLocaleString('ar-SA')}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="income" 
          name="الإيرادات" 
          fill={resolvedTheme === 'dark' ? '#34d399' : '#10b981'}
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="expense" 
          name="المصروفات" 
          fill={resolvedTheme === 'dark' ? '#f87171' : '#ef4444'}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Line Chart Component
export function TrendLineChart({ data }: { data: LineChartData[] }) {
  const { resolvedTheme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={resolvedTheme === 'dark' ? '#34d399' : '#10b981'} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={resolvedTheme === 'dark' ? '#34d399' : '#10b981'} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}
        />
        <XAxis 
          dataKey="date" 
          tick={{ fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
          axisLine={{ stroke: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0' }}
        />
        <YAxis 
          tick={{ fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
          axisLine={{ stroke: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0' }}
          tickFormatter={(value) => value.toLocaleString('ar-SA')}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="value" 
          name="الرصيد"
          stroke={resolvedTheme === 'dark' ? '#34d399' : '#10b981'}
          fillOpacity={1} 
          fill="url(#colorValue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Mini Chart for Dashboard
export function MiniTrendChart({ data, color = '#10b981' }: { data: number[]; color?: string }) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`miniGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color}
          fill={`url(#miniGradient-${color.replace('#', '')})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
