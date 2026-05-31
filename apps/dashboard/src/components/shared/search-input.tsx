'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({ placeholder = 'Search...', onSearch, debounceMs = 300 }: SearchInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, onSearch, debounceMs]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
