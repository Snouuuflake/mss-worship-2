import "./ControlSection.css";
import "./general-icon-button.css";
import Icon from "../Icon";
import { useContext, useRef, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";

function VerseButton({
  section,
  verseIndex,
  buttonID,
  object,
  selected,
  setSelected,
  updateState,
}: {
  section: Section;
  verseIndex: number;
  buttonID: number;
  object: any;
  selected: boolean;
  setSelected: (value: React.SetStateAction<number>) => void;
  updateState: () => void;
}) {
  const { MAX_LIVE_ELEMENTS, liveElementsState } = useContext(
    GlobalContext,
  ) as GlobalContextType;

  const matchingLiveIndexes = liveElementsState.value.flatMap((le, i) =>
    le.buttonID == buttonID && le.object == object ? [i] : [],
  );

  /** [0,1,...,MAX_LIVE_ELEMENTS-1] */
  const liveIndexesRange = Array.from(
    { length: MAX_LIVE_ELEMENTS },
    (_, i) => i,
  );

  const someMatching = !!matchingLiveIndexes.length;
  const allMatching = matchingLiveIndexes.length == MAX_LIVE_ELEMENTS;

  const thisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selected && thisRef.current) {
      thisRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const editorContentRef = useRef<string>(
    section.verses[verseIndex].lines.reduce((p, c) => p + "\n" + c, ""),
  );

  return (
    <div className="verse-button-container-row" ref={thisRef}>
      <div className="icons-container">
        <div className="icon-container">
          <div
            className={`dot ${someMatching && !allMatching ? "blink" : ""}`}
            style={{
              backgroundColor: someMatching ? "var(--hi1)" : "white",
            }}
          ></div>
        </div>
        <div
          className="icon-container icon-button"
          style={{
            backgroundColor: editorOpen ? "var(--hi2)" : "",
            color: editorOpen ? "var(--icon-container-bg)" : "",
          }}
        >
          <span
            className="text-icon no-select"
            onClick={() => {
              if (editorOpen) {
                setEditorOpen(false);
              } else {
                setEditorOpen(true);
              }
            }}
          >
            {/* TODO: make state for editor?
             * -> state for text input & text icon save/cancel buttons
             * that alwas save text input state value but are hidden
             * it may fail spectacularly, but we edit the song object,
             * and then set the state to its value?? and cause a re-render??
             */}
            {editorOpen ? "X" : "E"}
          </span>
        </div>
        {editorOpen ? (
          <div className="icon-container icon-button">
            <span
              className="text-icon no-select"
              onClick={() => {
                if (editorOpen) {
                  if (editorContentRef.current.trim() !== "") {
                    section.verses[verseIndex].lines = editorContentRef.current
                      .replace(/[\n\r]/, "\n").replace(/\s*$(\n\s*$){2,}/gm,"")
                      .split("\n")
                      .map((l) => l.trim());
                  } else {
                    section.verses.splice(verseIndex, 1);
                  }
                  setEditorOpen(false);
                  updateState();
                }
              }}
            >
              S
            </span>
          </div>
        ) : (
          <></>
        )}
        <div
          className="icon-container"
          style={{
            backgroundColor: selected ? "white" : "var(--icon-container-bg)",
            flexGrow: 1,
          }}
        >
          <span
            className="text-icon s"
            style={{
              color: selected ? "var(--icon-container-bg)" : "white",
            }}
          >
            {/*s*/}
          </span>
        </div>
      </div>
      <div className="verse-button-container-col">
        <div className="display-indexes-container">
          {liveIndexesRange.map((i) => (
            <button
              tabIndex={-1}
              key={`di${i}`}
              className="display-index"
              style={{
                color:
                  typeof matchingLiveIndexes.find((j) => j == i) != "undefined"
                    ? "var(--hi1)"
                    : "gray",
              }}
              onClick={(e) => {
                e.preventDefault();
                if (
                  typeof matchingLiveIndexes.find((j) => j == i) !== "undefined"
                ) {
                  liveElementsState.set([
                    {
                      index: i,
                      liveElement: {
                        type: "none",
                        value: "",
                        buttonID: -1,
                        object: null,
                      },
                    },
                  ]);
                } else {
                  liveElementsState.set([
                    {
                      index: i,
                      liveElement: {
                        type: "text",
                        value: section.verses[verseIndex].lines
                          .reduce((p, c) => p + "\n" + c, "")
                          .trim(),
                        buttonID: buttonID,
                        object: object,
                      },
                    },
                  ]);
                }
              }}
            >
              {i + 1}
            </button>
          ))}
          <div className="up-down-container">
            <button
              className="general-icon-button"
              onClick={() => {
                if (verseIndex > 0) {
                  [section.verses[verseIndex], section.verses[verseIndex - 1]] =
                    [
                      section.verses[verseIndex - 1],
                      section.verses[verseIndex],
                    ];

                  updateState();
                }
              }}
            >
              <Icon code="U" />
            </button>
            <button
              className="general-icon-button"
              onClick={() => {
                if (verseIndex < section.verses.length - 1) {
                  [section.verses[verseIndex], section.verses[verseIndex + 1]] =
                    [
                      section.verses[verseIndex + 1],
                      section.verses[verseIndex],
                    ];

                  updateState();
                }
              }}
            >
              <Icon code="D" />
            </button>
          </div>
        </div>

        {editorOpen ? (
          <textarea
            className="inline-verse-editor text-input"
            defaultValue={section.verses[verseIndex].lines
              .reduce((p, c) => p + "\n" + c, "")
              .slice(1)}
            style={{
            }}
            onChange={(event) => {
              editorContentRef.current = event.target.value;
            }}
          ></textarea>
        ) : (
          <button
            tabIndex={-1}
            className="verse-button"
            key={`b${buttonID}`}
            id={`verse-button-${buttonID}`}
            onClick={() => {
              setSelected(buttonID);
              liveElementsState.set(
                Array.from({ length: MAX_LIVE_ELEMENTS }).map((_, i) => {
                  return {
                    index: i,
                    liveElement: {
                      type: "text",
                      value: section.verses[verseIndex].lines
                        .reduce((p, c) => p + "\n" + c, "")
                        .trim(),
                      buttonID: buttonID,
                      object: object,
                    },
                  };
                }),
              );
            }}
          >
            <div className="verse-button-content">
              {section.verses[verseIndex].lines
                .flatMap((l, lIndex) => [
                  <hr className="verse-button-hr" key={`hr${lIndex}`} />,
                  <div key={`l${lIndex}`} className="line">
                    {l}
                  </div>,
                ])
                .slice(1)}
            </div>
          </button>
        )}
      </div>
      <div className="lights-container">
        <div
          className={`icon-container dot-light ${someMatching && !allMatching ? "blink" : ""} blinkcable`}
          style={{
            backgroundColor: someMatching ? "var(--hi1)" : "var(--gray-3)",
          }}
        ></div>
        <div
          className="icon-container s-light"
          style={{
            backgroundColor: selected ? "white" : "var(--icon-container-bg)",
            flexGrow: 1,
          }}
        ></div>
      </div>
    </div>
  );
}

export default VerseButton;
