
export interface Character {
  id: number;
  name: string;
  age: number;
  occupation: string;
  personality: string[];
  image: string;
  isPremium?: boolean;
  isVip?: boolean;
  description: string;
  hobbies: string[];
  favoriteFood: string;
  dreamDate: string;
}

export const characters: Character[] = [
  {
    id: 1,
    name: "Sakura Miyazaki",
    age: 22,
    occupation: "Estudiante de Arte",
    personality: ["Dulce", "Creativa", "Tímida", "Romántica"],
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    description: "Una artista apasionada que encuentra belleza en las pequeñas cosas de la vida.",
    hobbies: ["Pintura", "Fotografía", "Lectura", "Café"],
    favoriteFood: "Takoyaki",
    dreamDate: "Un picnic en el parque mientras pintamos juntos"
  },
  {
    id: 2,
    name: "Yuki Tanaka",
    age: 24,
    occupation: "Chef",
    personality: ["Enérgica", "Divertida", "Ambiciosa", "Cariñosa"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop",
    isPremium: true,
    description: "Una chef talentosa que cocina con amor y siempre está llena de energía.",
    hobbies: ["Cocina", "Viajes", "Deportes", "Música"],
    favoriteFood: "Ramen casero",
    dreamDate: "Cocinar juntos una cena especial"
  },
  {
    id: 3,
    name: "Rei Nakamura",
    age: 26,
    occupation: "Desarrolladora",
    personality: ["Inteligente", "Misteriosa", "Leal", "Independiente"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    isVip: true,
    description: "Una programadora brillante con un lado misterioso que pocos conocen.",
    hobbies: ["Gaming", "Tecnología", "Anime", "Café"],
    favoriteFood: "Sushi",
    dreamDate: "Una noche de gaming y películas de anime"
  },
  {
    id: 4,
    name: "Hana Sato",
    age: 20,
    occupation: "Idol",
    personality: ["Carismática", "Alegre", "Talentosa", "Optimista"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    isPremium: true,
    description: "Una idol en ascenso con una personalidad brillante y un corazón de oro.",
    hobbies: ["Canto", "Baile", "Fashion", "Redes sociales"],
    favoriteFood: "Bubble tea",
    dreamDate: "Un concierto privado bajo las estrellas"
  },
  {
    id: 5,
    name: "Mei Yamamoto",
    age: 23,
    occupation: "Bibliotecaria",
    personality: ["Intelectual", "Tranquila", "Empática", "Sabia"],
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop",
    description: "Una amante de los libros con una sabiduría que va más allá de su edad.",
    hobbies: ["Lectura", "Escritura", "Té", "Jardín"],
    favoriteFood: "Matcha latte",
    dreamDate: "Una tarde tranquila en una librería vintage"
  },
  {
    id: 6,
    name: "Akari Suzuki",
    age: 25,
    occupation: "Fotógrafa",
    personality: ["Aventurera", "Libre", "Artística", "Valiente"],
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
    isVip: true,
    description: "Una fotógrafa viajera que captura momentos únicos alrededor del mundo.",
    hobbies: ["Fotografía", "Viajes", "Aventura", "Naturaleza"],
    favoriteFood: "Street food",
    dreamDate: "Una aventura fotográfica al amanecer"
  }
];
