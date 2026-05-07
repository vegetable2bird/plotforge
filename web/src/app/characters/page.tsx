"use client";

import { useState } from "react";

import { CharacterList } from "@/components/character-list";
import { CharacterDetail } from "@/components/character-detail";
import { CharacterEditor } from "@/components/character-editor";
import { featuredCharacters } from "@/lib/mock-data";
import type { Character } from "@/lib/types";

export default function CharactersPage() {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  if (editingChar) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          <CharacterEditor
            character={editingChar}
            onSave={(updated) => { setEditingChar(null); setSelectedChar(updated); }}
            onCancel={() => setEditingChar(null)}
          />
        </div>
      </div>
    );
  }

  if (selectedChar) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          <CharacterDetail
            character={selectedChar}
            onEdit={() => setEditingChar(selectedChar)}
            onBack={() => setSelectedChar(null)}
          />
        </div>
      </div>
    );
  }

  return <CharacterList characters={featuredCharacters} onSelect={setSelectedChar} />;
}
