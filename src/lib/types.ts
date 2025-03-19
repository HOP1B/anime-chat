export type ModelType = {
  name?: string;
  imageUrl: string;
  description: string;
  nameOfChar: string;
};

export type CharacterPanelProps = {
  name: string;
  img: string;
  description: string;
};

export type CharacterFooterProps = {
  name: string;
};
export type Message = {
  id: string;
  content: string;
  role: "user" | "model";
  createdAt: string;
  text: string;
};
