import VerseButton from "./VerseButton";
import AddButtons from "./AddButtons";
import { GlobalContext } from "../GlobalContext";
import "./VerseButton.css";

import { useContext, useEffect, useState, useRef } from "react";

function SongControls({ song }: { song: Song }) {
  const [selected, setSelected] = useState<number>(0);
  const maxSelected = song.sectionOrder.flatMap((sei) =>
    sei.type === "section" || sei.type === "repeat"
      ? song.sections.find((s) => s.name === sei.name)!.verses
      : [],
  ).length;
  const { openElements } = useContext(GlobalContext) as GlobalContextType;

  useEffect(() => {
    function keyHandler(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.tagName !== "TEXTAREA") {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            if (selected > 0) {
              setSelected(selected - 1);
            }
            break;
          case "ArrowDown":
            event.preventDefault();
            if (selected < maxSelected - 1) {
              setSelected(selected + 1);
            }
            break;
          case " ":
          case "Enter":
            event.preventDefault();
            const buttonToPress = document.getElementById(
              `verse-button-${selected}`,
            );
            if (buttonToPress) {
              buttonToPress.click();
            }
          default:
            break;
        }
      }
    }

    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [selected]);

  let buttonIDCounter: number = -1;
  console.log(song);
  return [
    <div className="section-controls" key="sectioncontrols">
      {song.sectionOrder.map((sei, seiIndex) => {
        const updateState = () => {
          openElements.set([...openElements.value]);
        };
        return (
          <div key={`sc${seiIndex}`} style={{ display: "flex", gap: "5px" }}>
            <div style={{ flexGrow: 1 }}>{sei.name}</div>
            <button
              onClick={() => {
                song.sectionOrder.splice(seiIndex + 1, 0, {
                  type: "repeat",
                  name: sei.name,
                });
                // !! for deleting, we need to check if we're deleting the definition, if so, take the nearest repetition and make it definition, or, if none, ask the user if theyre sure
                updateState();
              }}
            >
              cp
            </button>
            <button
              onClick={() => {
                if (sei.type === "repeat") {
                  song.sectionOrder.splice(seiIndex, 1);
                  updateState();
                } else if (sei.type === "section") {
                  if (
                    song.sectionOrder.filter(
                      (sei2) =>
                        sei2.name === sei.name && sei2.type === "repeat",
                    ).length != 0
                  ) {
                    song.sectionOrder.find(
                      (sei2) =>
                        sei2.name === sei.name && sei2.type === "repeat",
                    )!.type = "section";
                    song.sectionOrder.splice(seiIndex, 1);
                  } else {
                    song.sectionOrder.splice(seiIndex, 1);
                    song.sections.splice(
                      song.sections.indexOf(
                        song.sections.find((s) => s.name === sei.name)!,
                      ),
                      1,
                    );
                  }

                  updateState();
                }
              }}
            >
              X
            </button>
            <button
              onClick={() => {
                if (seiIndex > 0) {
                  [
                    song.sectionOrder[seiIndex - 1],
                    song.sectionOrder[seiIndex],
                  ] = [
                    song.sectionOrder[seiIndex],
                    song.sectionOrder[seiIndex - 1],
                  ];
                  updateState();
                }
              }}
            >
              U
            </button>
            <button
              onClick={() => {
                if (seiIndex < song.sectionOrder.length - 1) {
                  [
                    song.sectionOrder[seiIndex + 1],
                    song.sectionOrder[seiIndex],
                  ] = [
                    song.sectionOrder[seiIndex],
                    song.sectionOrder[seiIndex + 1],
                  ];
                  updateState();
                }
              }}
            >D</button>
          </div>
        );
      })}
    </div>,
    ...song.sectionOrder.flatMap((sei, seiIndex) => {
      if (sei.type === "section" || sei.type === "repeat") {
        const currentSection = song.sections.find((s) => s.name == sei.name)!;
        return [
          <h3 key={`s${seiIndex}`} className="section-title">
            {sei.name}
          </h3>,

          currentSection.verses.map((_v, vIndex) => {
            buttonIDCounter += 1;
            return (
              <VerseButton
                key={`s${seiIndex}v${vIndex}`}
                section={currentSection}
                verseIndex={vIndex}
                buttonID={buttonIDCounter}
                object={song}
                selected={selected == buttonIDCounter}
                setSelected={setSelected}
              ></VerseButton>
            );
          }),

          <AddButtons
            song={song}
            key={`ab${seiIndex}`}
            section={currentSection}
            sectionOrderIndex={seiIndex}
          />,
        ];
      } else if (sei.type === "note") {
        return (
          <h4 key={sei.name} className="note">
            {song.notes.find((n) => n.name === sei.name)!.text}{" "}
          </h4>
        );
      }
    }),
  ];
  //} catch (err) {
  //  // NOTE: this is here because of the song.sections.find type assertion. could be undefined.
  //  //       if the song file was genereated remotely right, this should never happen.
  //  const e = err as Error;
  //  // TODO: handle this properly
  //  window.alert(
  //    `Error: ${e.message}.\nAn element of sectionOrder likely doesnt exist.`,
  //  );
  //}
}

export default SongControls;
