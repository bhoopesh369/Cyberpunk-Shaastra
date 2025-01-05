import { useState, useEffect } from 'react';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Users, Info, TableProperties, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [opened, { toggle }] = useDisclosure();
  const [isTableView, setIsTableView] = useState(true);
  
  interface Company {
    Symbol: string;
    Name: string;
    Sector: string;
    Industry: string;
    Description: string;
    "Full Time Employees": string;
    "Controversy Level": string;
    "Total ESG Risk score": number;
    "Environment Risk Score": number;
    "Social Risk Score": number;
    "Governance Risk Score": number;
  }

  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../rating.csv');
        const text = await response.text();
        const rows = text.split('\n');
        const headers = rows[0].split(',');

        const parsedData: Company[] = rows.slice(1)
          .map(row => {
            const values = row.split(',');
            return headers.reduce((obj: any, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              if (!isNaN(obj[header.trim()])) {
                obj[header.trim()] = parseFloat(obj[header.trim()]);
              }
              return obj;
            }, {} as Company);
          })
          .filter((company: Company) => company.Symbol);

        setCompanyData(parsedData);
        setSelectedCompany(parsedData[0]);
      } catch (error) {
        console.error('Error reading CSV:', error);
      }
    };

    fetchData();
  }, []);

  const getEsgData = (company: Company) => {
    return [
      { name: 'Environment', score: company["Environment Risk Score"] || 0 },
      { name: 'Social', score: company["Social Risk Score"] || 0 },
      { name: 'Governance', score: company["Governance Risk Score"] || 0 }
    ];
  };

  const CompanyTable = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sector</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ESG Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Controversy</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {companyData.map((company) => (
            <tr 
              key={company.Symbol}
              onClick={() => {
                setSelectedCompany(company);
                setIsTableView(false);
              }}
              className="hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{company.Name}</div>
                <div className="text-sm text-gray-400">{company.Symbol}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{company.Sector}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{company["Total ESG Risk score"]}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{company["Controversy Level"] || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CompanyDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedCompany?.Name}</h2>
            <div className="text-gray-400">{selectedCompany?.Symbol}</div>
          </div>
          {selectedCompany?.["Total ESG Risk score"] && (
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-300">Total ESG Risk Score</div>
              <div className="text-2xl font-bold text-white">
                {selectedCompany["Total ESG Risk score"]}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="text-blue-400" />
            <h3 className="font-semibold text-white">Sector & Industry</h3>
          </div>
          <div className="text-gray-400">{selectedCompany?.Sector}</div>
          <div className="text-gray-400">{selectedCompany?.Industry}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-400" />
            <h3 className="font-semibold text-white">Employees</h3>
          </div>
          <div className="text-gray-400">{selectedCompany?.["Full Time Employees"]}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Info className="text-blue-400" />
            <h3 className="font-semibold text-white">Controversy Level</h3>
          </div>
          <div className="text-gray-400">{selectedCompany?.["Controversy Level"] || "N/A"}</div>
        </div>
      </div>

      {selectedCompany?.["Environment Risk Score"] && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-white">ESG Risk Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getEsgData(selectedCompany)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: 'none',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-2 text-white">Company Description</h3>
        <p className="text-gray-400">{selectedCompany?.Description}</p>
      </div>
    </div>
  );

  if (!selectedCompany) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      className="bg-gray-900 min-h-screen"
    >
      <AppShell.Header className="flex items-center px-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="white"
            />
            <h1 className="text-xl font-bold text-white">Company Dashboard</h1>
          </div>
          <button
            onClick={() => setIsTableView(!isTableView)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            {isTableView ? (
              <>
                <LayoutDashboard size={16} />
                View Dashboard
              </>
            ) : (
              <>
                <TableProperties size={16} />
                View Table
              </>
            )}
          </button>
        </div>
      </AppShell.Header>

      <AppShell.Main className="bg-gray-900">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={isTableView ? 'table' : 'dashboard'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isTableView ? <CompanyTable /> : <CompanyDashboard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;