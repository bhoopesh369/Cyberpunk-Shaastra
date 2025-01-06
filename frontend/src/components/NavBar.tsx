import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const findTickerFromName = async (name:any) => {

        return name
        const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${name}&recommendCount=5`;
        const headers = {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        };

        try {
            const response = await fetch(url, { headers });
            const data = await response.json();
            if (data.quotes && data.quotes.length > 0) {
                return data.quotes[0].symbol; // Return the first ticker symbol
            } else {
                throw new Error('No results found');
            }
        } catch (error) {
            console.error('Error fetching ticker:', error);
            alert('Could not find a ticker for the given name. Please try again.');
            return null;
        }
    };

    const handleSearch = async (event:any) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            alert('Please enter a company name.');
            return;
        }

        setLoading(true);
        const ticker = await findTickerFromName(searchQuery);
        setLoading(false);

        if (ticker) {
            navigate(`/${ticker}`);
        }
    };

    return (
        <nav className="bg-slate-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white font-bold text-xl">
                    Green Finance Analyser
                </h1>
                <form className="flex items-center space-x-2" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for a company"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-md text-white ${
                            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>
        </nav>
    );
};

export default NavBar;
