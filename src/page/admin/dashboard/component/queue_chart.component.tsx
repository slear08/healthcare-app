import {
    BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
    Tooltip as RechartsTooltip, TooltipProps, XAxis, YAxis
} from 'recharts';

import { Button } from '@/components/ui/button';

type ChartType = 'line' | 'bar' | 'pie';

interface ChartData {
    name: string;
    value: number | null;
}

interface PieLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    name: string;
    value: number;
}

interface QueueChartProps {
    data: ChartData[];
    isLoading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FDB462'];

// Custom tooltip component for all charts
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as ChartData;
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                <p className="font-medium text-sm text-gray-900">{data.name}</p>
                <p className="text-sm text-primary">
                    Value: <span className="font-semibold">{data.value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const RADIAN = Math.PI / 180;
const CustomPieLabel = ({ cx, cy, midAngle, outerRadius, name, value }: PieLabelProps) => {
    // Increase the radius to push labels further out
    const radius = outerRadius * 1.1;
    // Calculate position
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate text anchor based on position
    const textAnchor = x > cx ? 'start' : 'end';

    // Only show label if value is not 0
    if (value === 0) return null;

    // Create background for better readability
    const boxWidth = `${name}: ${value}`.length * 7; // Approximate width based on text length
    const boxHeight = 20;
    const boxX = textAnchor === 'start' ? x : x - boxWidth;
    const boxY = y - boxHeight / 2;

    return (
        <g style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {/* Background rectangle */}
            <rect
                x={boxX}
                y={boxY}
                width={boxWidth}
                height={boxHeight}
                fill="white"
                opacity={0.9}
                rx={4}
                style={{ pointerEvents: 'none' }}
            />
            {/* Text */}
            <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="text-xs font-medium fill-foreground"
                style={{ pointerEvents: 'none' }}
            >
                {`${name}: ${value}`}
            </text>
        </g>
    );
};

export function QueueChart({ data, isLoading }: QueueChartProps) {
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (isLoading) {
        return (
            <div className="h-[350px] w-full">
                <div className="h-full w-full animate-pulse bg-muted rounded-lg" />
            </div>
        );
    }

    // Transform data to handle null values
    const transformedData = data.map((item) => ({
        name: item.name,
        value: item.value || 0,
    }));

    // Filter out items with value 0 for pie chart
    const pieData = transformedData.filter((item) => item.value > 0);

    // Find max value for Y axis
    const maxValue = Math.max(...transformedData.map((item) => item.value));
    const yAxisDomain = [0, Math.max(1, Math.ceil(maxValue))];

    const onPieEnter = (_: unknown, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={transformedData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => Math.round(value).toString()}
                            domain={yAxisDomain}
                            allowDecimals={false}
                        />
                        <RechartsTooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="currentColor"
                            strokeWidth={2}
                            dot={false}
                            className="stroke-primary"
                            activeDot={{
                                r: 6,
                                className: 'fill-primary stroke-white',
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={transformedData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => Math.round(value).toString()}
                            domain={yAxisDomain}
                            allowDecimals={false}
                        />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                        <Bar
                            dataKey="value"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {transformedData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    className={activeIndex === index ? 'fill-primary' : 'fill-primary/80'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                );
            case 'pie':
                if (pieData.length === 0) {
                    return (
                        <svg width="100%" height="100%">
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-lg font-medium text-muted-foreground"
                            >
                                No Data
                            </text>
                        </svg>
                    );
                }
                return (
                    <PieChart style={{ position: 'relative' }}>
                        <RechartsTooltip
                            content={<CustomTooltip />}
                            wrapperStyle={{ zIndex: 10, pointerEvents: 'none' }}
                        />
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            labelLine={false}
                            label={CustomPieLabel}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            isAnimationActive={false}
                        >
                            {pieData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                                    stroke={activeIndex === index ? '#fff' : 'none'}
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                );
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-end gap-2">
                <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChartType('line')}
                    title="Line Chart"
                >
                    <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChartType('bar')}
                    title="Bar Chart"
                >
                    <BarChartIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant={chartType === 'pie' ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChartType('pie')}
                    title="Pie Chart"
                >
                    <PieChartIcon className="h-4 w-4" />
                </Button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
}
