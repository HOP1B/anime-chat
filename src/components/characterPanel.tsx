import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard from "@/components/characterCard";

const CharacterPanel = () => {
  const [models, setModels] = useState<Character[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  interface Character {
    id: string;
    nameOfChar: string;
    imageUrl: string;
    name: string;
    description: string;
  }


  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Character[]>("/api/model");
        setModels(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to load characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);
  
  return (
    <>
      {models.map(
        (model: {
          id: string;
          nameOfChar: string;
          imageUrl: string;
          name: string;
          description: string;
        }) => (
          <CharacterCard
            key={model.id}
            name={model.name}
            nameOfChar={model.nameOfChar}
            imageUrl={model.imageUrl}
            description={model.description}
          />
        )
      )}
    </>
  );
};

export default CharacterPanel;
