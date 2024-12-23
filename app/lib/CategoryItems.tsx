import { CaseUpper, Globe, PartyPopper } from "lucide-react";
import { ReactNode } from "react";

interface iAppProps {
  name: string;
  title: string;
  image: ReactNode;
  id: number;
}

export const categoryItems: iAppProps[] = [
  {
    id: 0,
    name: "template",
    title: "Template",
    image: <Globe />,
  },
  {
    id: 1,
    name: "fonts",
    title: "Fonts",
    image: <CaseUpper />,
  },
  {
    id: 2,
    name: "icon",
    title: "Icon",
    image: <PartyPopper />,
  },
];