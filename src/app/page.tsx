"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import CharacterCard from "@/components/characterCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";

type Character = {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  nameOfChar?: string;
};

const Home = () => {
  const { session } = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Character[]>("/api/model");
        setCharacters(res.data);
        
        // Set first character as selected by default
        if (res.data.length > 0) {
          setSelectedCharacter(0);
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching characters:", error);
        setError("Failed to load characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Filter characters based on search query
  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (character.nameOfChar && character.nameOfChar.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Responsive settings for the carousel
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1536 },
      items: 5,
      partialVisibilityGutter: 40
    },
    desktop: {
      breakpoint: { max: 1536, min: 1024 },
      items: 4,
      partialVisibilityGutter: 30
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 3,
      partialVisibilityGutter: 20
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      partialVisibilityGutter: 10
    }
  };

  const handleCharacterSelect = (index: number) => {
    setSelectedCharacter(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b  text-white px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">Welcome back, player</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {session?.user.username || "Adventurer"}
            </p>
          </div>
          <div className="relative inline-flex items-center w-full md:w-auto">
            <Input
              className="w-full md:w-80 h-12 py-4 pl-10  text-white  rounded-full focus:ring-2  focus:outline-none focus:ring-blue-500"
              placeholder="Search for characters"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold mb-6 text-center md:text-left"
          >
            Select Your Character
          </motion.h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-16 w-16 border-4 border-t-blue-600 border-blue-400/50 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : filteredCharacters.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No characters found matching your search</div>
          ) : (
            <div className="w-full relative">
              <Carousel
                responsive={responsive}
                infinite={true}
                centerMode={true}
                removeArrowOnDeviceType={["mobile"]}
                customTransition="all 0.5s ease-in-out"
                containerClass="carousel-container py-12"
                itemClass="carousel-item px-4"
                sliderClass="carousel-slider"
                dotListClass="carousel-dots"
                focusOnSelect={true}
                afterChange={(index) => handleCharacterSelect(index)}
              >
                {filteredCharacters.map((character, index) => (
                  <div key={character.id} onClick={() => handleCharacterSelect(index)}>
                    <CharacterCard
                      name={character.name}
                      imageUrl={character.imageUrl}
                      description={character.description || "No description available"}
                      nameOfChar={character.nameOfChar || "Unknown Character"}
                      isSelected={selectedCharacter === index}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;