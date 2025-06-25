// API URL (fetch top 100 cryptocurrencies)
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
const COIN_HISTORY_URL = (id) => `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=hourly`;
const NEWS_API_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=cryptocurrency";

let chartInstance = null;

// Add currency switcher, sorting, and filtering
const SUPPORTED_CURRENCIES = [
    { code: 'usd', symbol: '$', name: 'USD' },
    { code: 'eur', symbol: '€', name: 'EUR' },
    { code: 'inr', symbol: '₹', name: 'INR' }
];
let currentCurrency = 'usd';
let currentSort = { key: 'market_cap_rank', asc: true };
let currentFilter = '';
let allCryptoData = [];
let lastPrices = {};

// CoinGecko API key (optional, for higher rate limits)
const COINGECKO_API_KEY = '';

// Helper for fetch with CoinGecko API key
async function fetchWithCGKey(url) {
    const headers = COINGECKO_API_KEY ? { 'x-cg-pro-api-key': COINGECKO_API_KEY } : {};
    return fetch(url, { headers });
}

// --- FAVORITES/WATCHLIST ---
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}
function isFavorite(coinId) {
    return getFavorites().includes(coinId);
}
function toggleFavorite(coinId) {
    let favs = getFavorites();
    if (favs.includes(coinId)) {
        favs = favs.filter(id => id !== coinId);
    } else {
        favs.push(coinId);
    }
    setFavorites(favs);
    displayCryptoData(allCryptoData);
}
let showWatchlist = false;
function setupWatchlistNav() {
    const nav = document.getElementById('watchlistNav');
    if (!nav) return;
    nav.onclick = function(e) {
        e.preventDefault();
        showWatchlist = !showWatchlist;
        nav.textContent = showWatchlist ? 'All Coins' : 'Watchlist';
        displayCryptoData(allCryptoData);
    };
}
// --- END FAVORITES/WATCHLIST ---

// Update API URL based on currency
function getApiUrl(currency) {
    return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
}

// Fetch crypto data
async function fetchCryptoData() {
    try {
        const response = await fetch(getApiUrl(currentCurrency));
        const data = await response.json();
        // Store previous prices for live change
        if (allCryptoData.length > 0) {
            allCryptoData.forEach(coin => {
                lastPrices[coin.id] = coin.current_price;
            });
        }
        allCryptoData = data;
        displayCryptoData(data);
        setupSearch(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Display data in the table with sorting and filtering
async function displayCryptoData(data) {
    const tableBody = document.getElementById("cryptoData");
    tableBody.innerHTML = "";
    let filtered = data;
    if (showWatchlist) {
        const favs = getFavorites();
        filtered = filtered.filter(coin => favs.includes(coin.id));
    }
    if (currentFilter) {
        filtered = filtered.filter(coin =>
            coin.name.toLowerCase().includes(currentFilter) ||
            coin.symbol.toLowerCase().includes(currentFilter)
        );
    }
    // Sorting
    filtered = filtered.sort((a, b) => {
        let valA = a[currentSort.key];
        let valB = b[currentSort.key];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return currentSort.asc ? -1 : 1;
        if (valA > valB) return currentSort.asc ? 1 : -1;
        return 0;
    });
    filtered.forEach(coin => {
        const row = document.createElement("tr");
        const priceChangeClass = coin.price_change_percentage_24h >= 0 ? "price-up" : "price-down";
        const favClass = isFavorite(coin.id) ? 'favorited' : '';
        // Calculate live change
        let liveChange = '';
        if (lastPrices[coin.id] !== undefined) {
            const diff = coin.current_price - lastPrices[coin.id];
            const percent = (diff / lastPrices[coin.id]) * 100;
            liveChange = `${diff >= 0 ? '+' : ''}${percent.toFixed(3)}%`;
        } else {
            liveChange = '--';
        }
        const liveChangeClass = liveChange.startsWith('+') ? 'price-up' : (liveChange.startsWith('-') ? 'price-down' : '');
        row.innerHTML = `
            <td>${coin.market_cap_rank}</td>
            <td>
                <img src="${coin.image}" alt="${coin.name}" width="20">
                ${coin.name} (${coin.symbol.toUpperCase()})
            </td>
            <td>${getCurrencySymbol()}${coin.current_price.toLocaleString()}</td>
            <td class="${priceChangeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td class="${liveChangeClass}">${liveChange}</td>
            <td>${getCurrencySymbol()}${coin.market_cap.toLocaleString()}</td>
            <td><button class="fav-btn ${favClass}" data-coin-id="${coin.id}">${isFavorite(coin.id) ? '★' : '☆'}</button></td>
        `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const coinId = btn.getAttribute('data-coin-id');
            toggleFavorite(coinId);
        });
    });
}

function getCurrencySymbol() {
    return SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency)?.symbol || '$';
}

// Currency switcher
function setupCurrencySwitcher() {
    const switcher = document.getElementById('currencySwitcher');
    SUPPORTED_CURRENCIES.forEach(c => {
        const btn = document.createElement('button');
        btn.textContent = c.symbol + ' ' + c.name;
        btn.className = 'currency-btn';
        btn.onclick = () => {
            currentCurrency = c.code;
            fetchCryptoData();
        };
        switcher.appendChild(btn);
    });
}

// Sorting and filtering UI
function setupSortAndFilter() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.onchange = function() {
        currentSort.key = sortSelect.value;
        fetchCryptoData();
    };
    const filterInput = document.getElementById('filterInput');
    filterInput.oninput = function(e) {
        currentFilter = e.target.value.toLowerCase();
        displayCryptoData(allCryptoData);
    };
}

// Theme toggle logic
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.onclick = function() {
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    };
}

// Fetch 12h price for each coin and calculate 12h change
async function fetch12hChange(coinId, currentPrice) {
    try {
        const now = Math.floor(Date.now() / 1000);
        const twelveHoursAgo = now - 12 * 60 * 60;
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${twelveHoursAgo}&to=${now}`;
        const res = await fetchWithCGKey(url);
        const data = await res.json();
        if (!data.prices || data.prices.length === 0) return null;
        const price12hAgo = data.prices[0][1];
        if (!price12hAgo) return null;
        const change = ((currentPrice - price12hAgo) / price12hAgo) * 100;
        return change;
    } catch (err) {
        return null;
    }
}

// Search functionality
function setupSearch(data) {
    const searchInput = document.getElementById("searchInput");
    
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = data.filter(coin => 
            coin.name.toLowerCase().includes(searchTerm) || 
            coin.symbol.toLowerCase().includes(searchTerm)
        );
        displayCryptoData(filteredData);
    });
}

// Initialize
fetchCryptoData();
setInterval(fetchCryptoData, 10000);
setupCurrencySwitcher();
setupSortAndFilter();
setupThemeToggle();
setupWatchlistNav();