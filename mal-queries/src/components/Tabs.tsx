import { Dispatch, SetStateAction, useState } from "react";
import { FC } from "react";
interface TabDataProps {
  setNum: (runningNumber: number) => void;
  TAB_DATA: Tab[];
}
interface Tab {
  name: string;
  mal_id: number;
}

export const Tabs: FC<TabDataProps> = ({ TAB_DATA, setNum }) => {
  const [selected, setSelected] = useState(1);
  return (
    <div className="mx-auto max-w-5xl w-10/12 lg:w-full pb-4">
      <div className="mx-0 min-w-full flex flex-wrap justify-center  auto-cols-max max-w-4xl gap-2 px-2 py-2">
        {TAB_DATA.map((t, ind) => (
          <ToggleButton
            key={ind}
            id={ind}
            selected={selected}
            setSelected={setSelected}
            setNum={setNum}
            mal_id={t.mal_id}
          >
            {t.name}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
};

const ToggleButton = ({
  children,
  selected,
  setSelected,
  id,
  setNum,
  mal_id,
}: {
  children: string;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  setNum: (mal_id: number) => void;
  id: number;
  mal_id: number;
}) => {
  return (
    <div
      onClick={() => setNum(mal_id)}
      className={`rounded-lg transition-colors ${
        selected === id ? "bg-neutral-600" : "bg-zinc-900"
      }`}
    >
      <button
        onClick={() => {
          setSelected(id);
        }}
        className={`w-fit min-w-12 origin-top-left rounded-lg border p-1 text-xs font-medium transition-all  ${
          selected === id
            ? "-translate-y-1 border-neutral-600 bg-neutral-950 text-white"
            : "border-neutral-900  text-neutral-500 hover:-rotate-2"
        }`}
      >
        {children}
      </button>
    </div>
  );
};
