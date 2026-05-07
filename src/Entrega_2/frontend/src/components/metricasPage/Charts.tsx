import { MetricasDashboard } from '@/types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend as PieLegend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend
} from 'recharts';
import styles from './Charts.module.css';

interface ChartsProps {
  data: MetricasDashboard;
}

const COLORS = ['#8A74F8', '#FF7EED', '#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

export function PieChartCard({ data }: ChartsProps) {
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{`${payload[0].name} : ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Distribuição de Itens (%)</h3>
      </div>
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.pizzaItems}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="percentual"
              nameKey="nome"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            >
              {data.pizzaItems.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip content={<CustomPieTooltip />} />
            <PieLegend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LineChartCard({ data }: ChartsProps) {
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipTitle}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={styles.tooltipData} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Dinheiro (R$)' ? `R$ ${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Progressão da Arrecadação</h3>
      </div>
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data.progressao}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="data" stroke="#888" tick={{ fill: '#888' }} />
            <YAxis yAxisId="left" stroke="#8A74F8" tick={{ fill: '#888' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#FF7EED" tick={{ fill: '#888' }} />
            <LineTooltip content={<CustomLineTooltip />} />
            <LineLegend verticalAlign="bottom" height={36} />
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="itens" 
              name="Itens (kg)" 
              stroke="#8A74F8" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#8A74F8' }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="dinheiro" 
              name="Dinheiro (R$)" 
              stroke="#FF7EED" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#FF7EED' }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
