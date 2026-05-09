import { TestData } from '../models/TestData';

export function getCommodities(data: TestData) {
  const result = [];

  for (let i = 1; i <= 5; i++) {
    const qty = data[`C${i}_Qty` as keyof TestData];

    if (!qty || Number(qty) === 0) continue;

    result.push({
      name: String(data[`C${i}_Name` as keyof TestData] || ''),
      length: Number(data[`C${i}_Length` as keyof TestData] || 0),
      width: Number(data[`C${i}_Width` as keyof TestData] || 0),
      height: Number(data[`C${i}_Height` as keyof TestData] || 0),
      weight: Number(data[`C${i}_Weight` as keyof TestData] || 0),
      volume: Number(data[`C${i}_Volume` as keyof TestData] || 0),
    });
  }

  console.log(result);

  return result;
}
