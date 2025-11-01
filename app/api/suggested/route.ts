export async function GET(){
  const SUGGESTED = [
    { city: 'Jaipur, India', highlights: ['Amber Fort','Hawa Mahal','Block-print bazaars'], best: 'Oct–Mar' },
    { city: 'Kyoto, Japan', highlights: ['Fushimi Inari','Arashiyama','Tea ceremony'], best: 'Mar–May / Oct–Nov' },
    { city: 'Lisbon, Portugal', highlights: ['Tram 28','Belém','Pastéis'], best: 'Apr–Jun / Sep–Oct' },
    { city: 'Bali, Indonesia', highlights: ['Ubud rice terraces','Uluwatu','Snorkeling'], best: 'Apr–Oct' },
    { city: 'Mumbai, India', highlights: ['Colaba','Marine Drive','Street food'], best: 'Nov–Feb' },
  ]
  return Response.json(SUGGESTED)
}
