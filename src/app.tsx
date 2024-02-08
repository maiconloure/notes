import { useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('notes');

    if (storedNotes) {
      return JSON.parse(storedNotes);
    }

    return []
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes];

    setNotes((prevNotes) => [newNote, ...prevNotes]);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => note.id !== id);

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  const filteredNotes = search !== ""
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img src={logo} alt="NLW Logo" />
      <form className="w-full">
        <input 
        type="text" 
        onChange={handleSearch}
        placeholder="Busque em suas notas..."
        className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
        />
      </form>

      <div className="h-[2px] bg-slate-700" />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />)}
      </div>
    </div>
  )
}