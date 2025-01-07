import { useState, useContext, Dispatch, SetStateAction, FC } from "react";
import { FaSadTear, FaTrash } from "react-icons/fa";
import { UserContext } from "../store/user-context";
import { CardType } from "../types";

const MyBoard = () => {
  return (
    <div className="min-h-screen w-full mx-auto text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const userData = useContext(UserContext);
  if (!userData) {
    return;
  }
  const { savedAnime, setSavedAnime } = userData;

  return (
    <>
      {/* <div className="mx-auto max-w-5xl">
        <button
          className="px-2 py-1 border border-rose-300"
          onClick={clearAllData}
        >
          KILL SWITCH
        </button>
        {savedAnime.map((anime) => (
          <p>{anime.title}</p>
        ))}
      </div> */}
      <div className="grid grid-cols-12 grid-rows-2 sm:flex sm:items-start h-[720px] sm:h-full w-full gap-3 p-12 max-w-5xl mx-auto">
        <Column
          title="To Watch"
          headingColor="text-white"
          column="toWatch"
          cards={savedAnime}
          setCards={setSavedAnime}
        />
        <Column
          title="Watched - Hate"
          headingColor="text-red-500"
          column="watchedHate"
          cards={savedAnime}
          setCards={setSavedAnime}
        />
        <Column
          title="Watched - Love"
          headingColor="text-green-400"
          column="watchedLove"
          cards={savedAnime}
          setCards={setSavedAnime}
        />
        <BurnBarrel setCards={setSavedAnime} />
      </div>
    </>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: string;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const Column: FC<ColumnProps> = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}) => {
  const [active, setActive] = useState(false);
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    card: CardType
  ) => {
    e.dataTransfer.setData("cardId", card.id.toString());
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const nativeEvent = e.nativeEvent;
    highlightIndicator(nativeEvent);
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setActive(false);
    clearHighlights();

    // Get the card ID from the drag event
    const cardId = parseInt(e.dataTransfer.getData("cardId"), 10);

    // Find all indicators in the column
    const indicators = getIndicators();

    // Find the nearest indicator based on the mouse event
    const { element } = getNearestIndicator(e.nativeEvent, indicators);

    // Get the 'before' value from the dataset of the nearest indicator
    if (!element.dataset.before) {
      return;
    }
    const before = parseInt(element.dataset.before, 10);

    // If the 'before' value is the same as the cardId, no movement is necessary
    if (before === cardId) return;

    // Create a copy of the cards array
    let copy = [...cards];

    // Find the card to transfer
    let cardToTransfer = copy.find((c) => c.id === cardId);

    // If the card doesn't exist, return
    if (!cardToTransfer) return;

    // Update the column of the card
    cardToTransfer = { ...cardToTransfer, column };

    // Remove the card from its current position
    copy = copy.filter((c) => c.id !== cardId);

    // Determine where to place the card
    if (before === -1) {
      // Move to the end of the column if 'before' is -1
      copy.push(cardToTransfer);
    } else {
      // Find the index where the card should be inserted
      const insertAtIndex = copy.findIndex((el) => el.id === before);
      if (insertAtIndex === -1) return;

      // Insert the card at the found index
      copy.splice(insertAtIndex, 0, cardToTransfer);
    }

    // Update the state with the new card arrangement
    setCards(copy);
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i: HTMLElement) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };
  const getIndicators = (): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll(`
        [data-column="${column}"]`)
    );
  };

  const filteredCards = cards.filter((c) => c.column === column);
  return (
    <div className="col-span-4 w-28 sm:w-56 shrink-0">
      <div className="mb-1 sm:mb-3 flex items-center justify-center gap-2 sm:justify-between sm:gap-0">
        <h3 className={`text-xs sm:text-base font-medium ${headingColor}`}>
          {title}
        </h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      {/* Cards Section */}
      <div
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
        className={`min-h-screen w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card handleDragStart={handleDragStart} key={c.id} {...c} />;
        })}
        <DropIndicator beforeId={"-1"} column={column} />
      </div>
    </div>
  );
};

interface CardProp extends CardType {
  handleDragStart: Function;
}

const Card: FC<CardProp> = ({ title, id, column, handleDragStart, images }) => {
  return (
    <>
      <DropIndicator beforeId={id.toString()} column={column} />
      <div
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="brightness-50 hover:brightness-75 transition-all sm:h-24 max-h-40 relative cursor-grab rounded border active:cursor-grabbing overflow-hidden"
      >
        <img
          src={images.webp.image_url}
          className="absolute inset-0 object-cover object-center w-full h-full"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <p className="relative z-40 m-4 text-white sm:font-semibold text-xs sm:text-lg line-clamp-1">
          {title}
        </p>
      </div>
    </>
  );
};

const DropIndicator: FC<{ beforeId: string; column: string }> = ({
  beforeId,
  column,
}) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    ></div>
  );
};
interface BurnBarrelProps {
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}

const BurnBarrel: FC<BurnBarrelProps> = ({ setCards }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };
  const handleDragLeave = () => {
    setActive(false);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((prev: CardType[]) => {
      return prev.filter((c) => c.id.toString() != cardId);
    });
    setActive(false);
  };
  const [active, setActive] = useState(false);
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`col-span-12 mx-auto mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaSadTear /> : <FaTrash />}
    </div>
  );
};

export default MyBoard;
