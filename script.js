async function convertCrypto() {
  const amount = document.getElementById('amount').value;
  const crypto = document.getElementById('crypto').value;
  const currency = document.getElementById('currency').value;
  const resultElement = document.getElementById('result');

  if (!amount) {
    resultElement.textContent = 'Please enter an amount.';
    return;
  }

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`);
    const data = await response.json();
    const convertedValue = (amount * data[crypto][currency]).toFixed(2);
    resultElement.textContent = `${amount} ${crypto.toUpperCase()} = ${convertedValue} ${currency.toUpperCase()}`;
  } catch (error) {
    resultElement.textContent = 'Error fetching conversion rates.';
  }
}

async function fetchPriceHistory() {
  const crypto = document.getElementById('crypto').value;
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7`);
    const data = await response.json();
    const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1].toFixed(2));

    const ctx = document.getElementById('priceHistoryChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${crypto.toUpperCase()} Price (Last 7 Days)`,
          data: prices,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        }]
      },
    });
  } catch (error) {
    console.error('Failed to fetch price history:', error);
  }
}

async function fetchTrendingCryptos() {
  const trendingElement = document.getElementById('trending-cryptos');
  trendingElement.innerHTML = '';
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
    const data = await response.json();

    data.coins.slice(0, 5).forEach(coinData => {
      const coin = coinData.item;
      const card = document.createElement('div');
      card.className = 'crypto-card';
      card.innerHTML = `<h3>${coin.name} (${coin.symbol.toUpperCase()})</h3><p>Rank: ${coin.market_cap_rank}</p>`;
      trendingElement.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching trending cryptos:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchPriceHistory();
  fetchTrendingCryptos();
});
