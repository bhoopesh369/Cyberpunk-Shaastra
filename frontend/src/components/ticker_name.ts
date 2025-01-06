async function getSymbol(symbol: any) {
    try {
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const response = await fetch(`${corsProxy}http://chstocksearch.herokuapp.com/api/${symbol}`);
        const symbolList = await response.json();

        for (const item of symbolList) {
            if (item.symbol === symbol) {
                return item.company;
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching symbol data:", error);
        return null;
    }
}

export default getSymbol;
