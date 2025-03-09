import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const data = [
    { name: 'Mon', value: 20 },
    { name: 'Tue', value: 40 },
    { name: 'Wed', value: 30 },
    { name: 'Thu', value: 50 },
    { name: 'Fri', value: 35 },
    { name: 'Sat', value: 25 },
    { name: 'Sun', value: 15 },
];

export function QueueChart() {
    return (
        <ChartContainer
            config={{
                value: {
                    label: 'Total',
                    color: 'hsl(var(--chart-1))',
                },
            }}
            className="min-h-[200px]"
        >
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
