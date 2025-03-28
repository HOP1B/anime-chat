import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard, {
  CharacterCardSkeleton,
} from "@/components/characterCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

interface ModelData {
  id: string;
  nameOfChar: string;
  imageUrl: string;
  name: string;
  description: string;
}

interface CharacterPanelProps {
  searchTerm?: string;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({ searchTerm = "" }) => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/model");
        setModels(res.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const filteredModels = models.filter((model) =>
    [model.name, model.nameOfChar, model.description].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="w-full h-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="h-full py-2">
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/5 h-[calc(100vh-24px)]"
                  >
                    <CharacterCardSkeleton />
                  </CarouselItem>
                ))
            : filteredModels.map((model) => (
                <CarouselItem
                  key={model.id || model.name}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/5 h-[calc(100vh-24px)] "
                >
                  <CharacterCard
                    name={model.name}
                    nameOfChar={model.nameOfChar}
                    imageUrl={model.imageUrl}
                    description={model.description}
                  />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 h-10 w-10" />
        <CarouselNext className="right-4 h-10 w-10" />
      </Carousel>
    </div>
  );
};

export default CharacterPanel;
