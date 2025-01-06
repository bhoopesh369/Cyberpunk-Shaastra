import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, Leaf, Users, Scale, LucideIcon } from 'lucide-react';
import tickerName from '../../ticker-name.json';

function findCompanyByTicker(ticker: string) {
  if (!ticker || typeof ticker !== 'string') {
    return null; // Handle invalid ticker input
  }
  const company = tickerName.find((company: any) => company.ticker === ticker.toUpperCase()); // case insensitive comparison using toUpperCase

  return company ? company : null;
}

// Interfaces
interface ESGData {
  year: number;
  symbol: string;
  'Total-Score': number;
  'E-Score': number;
  'S-Score': number;
  'G-Score': number;
}

interface ScoreCardProps {
  title: string;
  score: number;
  color: string;
  icon: LucideIcon;
}

interface AnimatedScores {
  'Total-Score': number;
  'E-Score': number;
  'S-Score': number;
  'G-Score': number;
}

interface RouteParams {
  ticker: string;
}

const Ticker: React.FC = () => {
  const { ticker } = useParams() as unknown as RouteParams;
  const [data, setData] = useState<ESGData[]>([]);
  const [selectedCompanyData, setSelectedCompanyData] = useState<ESGData[]>([]);
  const [latestScores, setLatestScores] = useState<ESGData | null>(null);
  const [animatedScores, setAnimatedScores] = useState<AnimatedScores>({
    'Total-Score': 0,
    'E-Score': 0,
    'S-Score': 0,
    'G-Score': 0
  });

  useEffect(() => {
    const filePath = '../../rating-per-year.csv';
    fetch(filePath)
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split('\n').filter((row) => row.trim());

        const parsedData: ESGData[] = rows.slice(1).map((row) => {
          const values = row.split(',');
          return {
            year: parseInt(values[0]),
            symbol: values[1],
            'Total-Score': parseFloat(values[2]),
            'E-Score': parseFloat(values[3]),
            'S-Score': parseFloat(values[4]),
            'G-Score': parseFloat(values[5])
          };
        });

        setData(parsedData);
      })
      .catch((error: Error) => {
        console.error('Error loading the CSV file:', error);
      });
  }, []);

  useEffect(() => {
    if (ticker && data.length > 0) {
      const filteredData = data.filter((item) => item.symbol === ticker.toUpperCase());
      setSelectedCompanyData(filteredData);

      if (filteredData.length > 0) {
        const mostRecent = filteredData.reduce((prev, current) =>
          prev.year > current.year ? prev : current
        );
        setLatestScores(mostRecent);

        // Reset animated scores
        setAnimatedScores({
          'Total-Score': 0,
          'E-Score': 0,
          'S-Score': 0,
          'G-Score': 0
        });

        // Animate scores
        const duration = 1000; // 1 second animation
        const steps = 30; // Number of steps in animation
        let currentStep = 0;

        const interval = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;

          setAnimatedScores((prev) => ({
            'Total-Score': Math.min(mostRecent['Total-Score'] * progress, mostRecent['Total-Score']),
            'E-Score': Math.min(mostRecent['E-Score'] * progress, mostRecent['E-Score']),
            'S-Score': Math.min(mostRecent['S-Score'] * progress, mostRecent['S-Score']),
            'G-Score': Math.min(mostRecent['G-Score'] * progress, mostRecent['G-Score'])
          }));

          if (currentStep >= steps) {
            clearInterval(interval);
          }
        }, duration / steps);

        return () => clearInterval(interval);
      }
    }
  }, [ticker, data]);

  const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, color, icon: Icon }) => (
    <div className="bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm  text-white font-bold">{title}</h3>
      </div>
      <div className="flex items-center space-x-4">
        <Icon className="w-6 h-6" style={{ color }} />
        <div className="text-3xl font-semibold" style={{ color }}>
          {score?.toFixed(1)}
        </div>
      </div>
    </div>
  );

  const getMinMaxValues = (data: ESGData[]) => {
    const allScores = data.flatMap((item) => [
      item['Total-Score'],
      item['E-Score'],
      item['S-Score'],
      item['G-Score']
    ]);
    const min = Math.min(...allScores);
    const max = Math.max(...allScores);
    return { min, max };
  };

  const { min, max } = getMinMaxValues(selectedCompanyData);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-4xl font-semibold text-gray-800">
            {findCompanyByTicker(ticker?.toUpperCase() || 'N/A')?.name}
          </h2>
          {/* add sector and industry also */}
          <p className="text-gray-500 text-sm">
            {findCompanyByTicker(ticker?.toUpperCase() || 'N/A')?.sector} | {findCompanyByTicker(ticker?.toUpperCase() || 'N/A')?.industry}
          </p>
        </div>

        {latestScores && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ScoreCard
                title="Total Score"
                score={animatedScores['Total-Score']}
                color="#8884d8"
                icon={Award}
              />
              <ScoreCard
                title="Environmental Score"
                score={animatedScores['E-Score']}
                color="#82ca9d"
                icon={Leaf}
              />
              <ScoreCard
                title="Social Score"
                score={animatedScores['S-Score']}
                color="#ffc658"
                icon={Users}
              />
              <ScoreCard
                title="Governance Score"
                score={animatedScores['G-Score']}
                color="#ff7300"
                icon={Scale}
              />
            </div>
          </div>
        )}

        <div className="p-6">
          {selectedCompanyData.length > 0 ? (
            <div className="h-96 w-full bg-white rounded-lg border border-gray-200 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedCompanyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#9ca3af' }}
                  />
                  <YAxis
                    domain={[min, Math.floor(max + 5)]}
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#9ca3af' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      padding: '0.5rem'
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '0.5rem'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Total-Score"
                    stroke="#8884d8"
                    name="Total Score"
                    strokeWidth={2}
                    strokeDasharray={selectedCompanyData.some(item => item.year > 2024) ? "3 3" : ""}
                  />
                  <Line
                    type="monotone"
                    dataKey="E-Score"
                    stroke="#82ca9d"
                    name="Environmental Score"
                    strokeWidth={2}
                    strokeDasharray={selectedCompanyData.some(item => item.year > 2024) ? "3 3" : ""}
                  />
                  <Line
                    type="monotone"
                    dataKey="S-Score"
                    stroke="#ffc658"
                    name="Social Score"
                    strokeWidth={2}
                    strokeDasharray={selectedCompanyData.some(item => item.year > 2024) ? "3 3" : ""}
                  />
                  <Line
                    type="monotone"
                    dataKey="G-Score"
                    stroke="#ff7300"
                    name="Governance Score"
                    strokeWidth={2}
                    strokeDasharray={selectedCompanyData.some(item => item.year > 2024) ? "3 3" : "none"}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No data found for ticker {ticker?.toUpperCase() || 'N/A'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticker;