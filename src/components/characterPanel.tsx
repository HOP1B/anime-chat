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

const CharacterPanel = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [api, setApi] = useState<CarouselApi>();

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

  return (
    <div className="w-full h-full">
      <Carousel
        setApi={setApi}
        className="h-full"
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="h-full py-2">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-[calc(100vh-180px)]"
                  >
                    <CharacterCardSkeleton />
                  </CarouselItem>
                ))
            : models.map(
                (model: {
                  id: string;
                  nameOfChar: string;
                  imageUrl: string;
                  name: string;
                  description: string;
                }) => (
                  <CarouselItem
                    key={model.id || model.name}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-[calc(100vh-180px)] hover:scale-110 transition-transform duration-300 ease-in-out"
                  >
                    <CharacterCard
                      name={model.name}
                      nameOfChar={model.nameOfChar}
                      imageUrl={model.imageUrl}
                      description={model.description}
                    />
                  </CarouselItem>
                )
              )}
        </CarouselContent>
        <CarouselPrevious className="left-4 h-10 w-10" />
        <CarouselNext className="right-4 h-10 w-10" />
      </Carousel>
    </div>
  );
};

export default CharacterPanel;
