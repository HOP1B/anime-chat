import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard from "@/components/characterCard";

const CharacterPanel = () => {
  const [models, setModels] = useState([]); // Store fetched models

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get("/api/model");
        setModels(res.data);
      } catch (error) {
        console.error("Error fetching models:", error);
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
            img={model.imageUrl}
            description={model.description}
          />
        )
      )}
    </>
  );
};

export default CharacterPanel;
