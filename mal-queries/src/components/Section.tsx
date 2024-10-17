import { FC } from "react";
interface SectionProps {
  topic: string;
}
const Section: FC<SectionProps> = ({ topic }) => {
  return (
    <>
      <h2>{topic}</h2>
    </>
  );
};
export default Section;
