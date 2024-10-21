import { div } from "framer-motion/client";
import { useState } from "react";
import { FaSadTear, FaTrash } from "react-icons/fa";
import { PiCloudSnowLight } from "react-icons/pi";

const DEFAULT_CARDS = [
  {
    id: 1,
    title: "Naruto",
    description: "A story about a young ninja with big dreams.",
    column: "toWatch",
  },
  {
    id: 2,
    title: "Attack on Titan",
    description: "Survival against titans and the fight for freedom.",
    column: "watchedLove",
  },
  {
    id: 3,
    title: "One Piece",
    description: "A pirate's adventure to find the greatest treasure.",
    column: "toWatch",
  },
  {
    id: 4,
    title: "Death Note",
    description: "A notebook with the power to kill.",
    column: "watchedHate",
  },
  {
    id: 5,
    title: "Demon Slayer",
    description:
      "A young boy fights demons to avenge his family and save his sister.",
    column: "toWatch",
  },
  {
    id: 6,
    title: "My Hero Academia",
    description:
      "In a world of heroes and villains, one boy strives to be the best hero.",
    column: "watchedLove",
  },
  {
    id: 7,
    title: "Fullmetal Alchemist",
    description:
      "Two brothers search for a way to restore their bodies using alchemy.",
    column: "toWatch",
  },
  {
    id: 8,
    title: "Tokyo Ghoul",
    description:
      "A young man becomes a half-ghoul and must navigate his new life.",
    column: "watchedHate",
  },
  {
    id: 9,
    title: "Hunter x Hunter",
    description:
      "A boy becomes a hunter to find his missing father and explore the world.",
    column: "toWatch",
  },
  {
    id: 10,
    title: "Dragon Ball Z",
    description:
      "Fighters protect Earth from powerful enemies in epic battles.",
    column: "watchedLove",
  },
  {
    id: 11,
    title: "Bleach",
    description:
      "A teenager gains the powers of a Soul Reaper and battles evil spirits.",
    column: "toWatch",
  },
  {
    id: 12,
    title: "Fairy Tail",
    description: "Wizards from a magical guild embark on adventures together.",
    column: "watchedLove",
  },
  {
    id: 13,
    title: "Sword Art Online",
    description:
      "Players trapped in a virtual reality game must fight for survival.",
    column: "watchedHate",
  },
  {
    id: 14,
    title: "Cowboy Bebop",
    description:
      "A space-faring bounty hunter crew pursues criminals across the galaxy.",
    column: "toWatch",
  },
  {
    id: 15,
    title: "Code Geass",
    description:
      "A young man gains a mysterious power and sets out to overthrow an empire.",
    column: "watchedLove",
  },
  {
    id: 16,
    title: "Neon Genesis Evangelion",
    description:
      "Teenagers pilot giant mechs to defend Earth from monstrous beings.",
    column: "watchedHate",
  },
  {
    id: 17,
    title: "Black Clover",
    description: "A boy without magic strives to become the Wizard King.",
    column: "toWatch",
  },
  {
    id: 18,
    title: "Mob Psycho 100",
    description:
      "A young psychic battles spirits and other supernatural threats.",
    column: "watchedLove",
  },
  {
    id: 19,
    title: "Steins;Gate",
    description:
      "A group of friends discovers time travel with serious consequences.",
    column: "watchedHate",
  },
  {
    id: 20,
    title: "JoJo's Bizarre Adventure",
    description: "Generations of warriors fight using powerful Stands.",
    column: "toWatch",
  },
];

const MyBoard = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState([...DEFAULT_CARDS]);
  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="To Watch"
        headingColor="text-white"
        column="toWatch"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Watched - Hate"
        headingColor="text-red-500"
        column="watchedHate"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Watched - Love"
        headingColor="text-green-400"
        column="watchedLove"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, column, cards, setCards }) => {
  const [active, setActive] = useState(false);
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
    // console.log(card.id);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = (e) => {
    setActive(false);
    clearHighlights();
  };
  const handleDragEnd = (e) => {
    setActive(false);
    clearHighlights();

    // Get the card ID from the drag event
    const cardId = parseInt(e.dataTransfer.getData("cardId"), 10);

    // Find all indicators in the column
    const indicators = getIndicators();

    // Find the nearest indicator based on the mouse event
    const { element } = getNearestIndicator(e, indicators);

    // Get the 'before' value from the dataset of the nearest indicator
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

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e, indicators) => {
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
  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`
        [data-column="${column}"]`)
    );
  };

  const filteredCards = cards.filter((c) => c.column === column);
  return (
    <div className="w-56 shrink-0 ">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      {/* Cards Section */}
      <div
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card handleDragStart={handleDragStart} key={c.id} {...c} />;
        })}
        <DropIndicator beforeId={-1} column={column} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, description, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <div
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, { title, id, column, description })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
        <p className="text-xs text-neutral-400">{description}</p>
      </div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    ></div>
  );
};

const BurnBarrel = ({ setCards }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };
  const handleDragLeave = () => {
    setActive(false);
  };
  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((prev) => {
      return prev.filter((c) => c.id != cardId);
    });
    setActive(false);
  };
  const [active, setActive] = useState(false);
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
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
