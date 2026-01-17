export async function getWeather(location: string) {
  return {
    tool: "getWeather",
    location,
    temp: "32°C",
    condition: "Sunny",
  };
}

export async function getF1Matches() {
  return {
    tool: "getF1Matches",
    race: "Monaco Grand Prix",
    date: "2026-05-24",
  };
}

export async function getStockPrice(symbol: string) {
  return {
    tool: "getStockPrice",
    symbol,
    price: "$182.30",
  };
}
