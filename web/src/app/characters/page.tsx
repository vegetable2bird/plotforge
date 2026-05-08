"use client";

import { useState, useEffect, useCallback } from "react";

import { CharacterList } from "@/components/character-list";
import { CharacterDetail } from "@/components/character-detail";
import { CharacterEditor } from "@/components/character-editor";
import { api } from "@/lib/api-client";
import type { Character } from "@/lib/types";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCharacters = useCallback(async () => {
    try {
      const data = await api.characters.list("work-1");
      setCharacters(data);
    } catch (err) {
      console.error("Failed to load characters:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCharacters(); }, [loadCharacters]);

  const handleSave = async (updated: Character) => {
    try {
      const result = await api.characters.update(updated.id, updated);
      setEditingChar(null);
      setSelectedChar(result);
      await loadCharacters();
    } catch (err) {
      console.error("Failed to save character:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const newChar = await api.characters.create({
        workId: "work-1",
        name: "新角色",
        role: "待定",
        appearance: "",
        personality: "",
        backstory: "",
        habits: [],
        catchphrase: "",
        weakness: "",
        mission: "",
        taboo: "",
        arc: "",
        biography: "",
        avatar: "新",
        tags: [],
      });
      await loadCharacters();
      setSelectedChar(newChar);
      setEditingChar(newChar);
    } catch (err) {
      console.error("Failed to create character:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>加载中...</p>
      </div>
    );
  }

  if (editingChar) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          <CharacterEditor
            character={editingChar}
            onSave={handleSave}
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

  return (
    <div className="relative">
      <CharacterList characters={characters} onSelect={setSelectedChar} onCreate={handleCreate} />
    </div>
  );
}
