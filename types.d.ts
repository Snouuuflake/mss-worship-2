class Verse {
  lines: Array<string>;
  constructor(lines: string[]) {
    this.lines = lines;
  }
}

class Section {
  name: string;
  verses: Array<Verse>;
  constructor(name: string, verses: Verse[]) {
    this.name = name;
    this.verses = verses;
  }
}

class Note {
  name: string;
  text: string;
  constructor(name: string, text: string) {
    this.name = name;
    this.text = text;
  }
}

class SongElementIdentifier {
  type: "section" | "note" | "repeat";
  name: string;
  constructor(type: "section" | "note" | "repeat", name: string) {
    this.type = type;
    this.name = name;
  }
}

class SongProperties {
  title: string;
  author: string;
  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
  }
}

class Song {
  properties: SongProperties;
  sections: Array<Section>;
  notes: Note[];
  sectionOrder: Array<SongElementIdentifier>;
  constructor(
    properties: SongProperties,
    sections: Section[],
    notes: Note[],
    sectionOrder: SongElementIdentifier[],
  ) {
    this.properties = properties;
    this.sections = sections;
    this.notes = notes;
    this.sectionOrder = sectionOrder;
  }
}

type testType = {
  testProp: number;
};

interface Window {
  electron: {
    invokeReadSong: (callback: (song: Song) => void) => void;
    invokeSaveSong: (song: Song) => Promise<void>;
    sendSetLiveElement: (index: number, liveElement: LiveElementType) => void;
    testFunction: () => string;
    sendNewDisplayWindow: (index: number) => void;
    sendAlert: (message: string) => void;
    invokeIndex: () => Promise<any>;
    onDisplayText: (index: number, callback: (text: string) => void) => void;
    onDisplayImage: (index: number, callback: (path: string) => void) => void;
  };
}

type GlobalContextType = {
  MAX_LIVE_ELEMENTS: number;
  liveElementsState: LiveElementsState;
  openElements: OpenElementsState;
  viewElement: OpenElementState;
};

/**
 * type: "none" | "song"
 */
type OpenElementType = {
  type: "none" | "song";
  song: Song?;
};

type OpenElementState = {
  value: OpenElementType;
  set: (newValue: OpenElementType) => void;
};

type OpenElementsState = {
  value: OpenElementType[];
  set: (newValue: OpenElementType[]) => void;
};

/**
 * type: "none" | "text" (for lyrics)
 * value: text or path to be projected
 * buttonID: ui button that was selected (if applicable). if -1 -> none.
 * object: literal reference to the song or whatever object in react
 */
type LiveElementType = {
  type: string;
  value: string;
  buttonID: number;
  object: any;
};

type IndexedLiveElementsObject = {
  index: number;
  liveElement: LiveElementType;
};

type LiveElementsState = {
  value: LiveElementType[];
  set: (IndexedLiveElementsObject) => void;
};
