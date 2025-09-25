"use client";

import toast, { Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

interface Props {
  query: string;
  page: number;
}

export default function NotesClient({ query, page }: Props) {
  const [search, setSearch] = useState(query);
  const [currentPage, setCurrentPage] = useState(page);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedQuery] = useDebounce(search, 500);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["notes", debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isError) {
      toast.error("Couldn't find any notes!");
    } else if (data?.notes.length === 0) {
      toast.error(`No notes found for "${debouncedQuery}"`);
    }
  }, [isError, data, debouncedQuery]);

  return (
    <>
      <div className={css.app}>
        <div className={css.toolbar}>
          <SearchBox
            defValue={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {isSuccess && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onChange={setCurrentPage}
            />
          )}

          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </div>

        {data !== undefined && data?.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
      <Toaster />
    </>
  );
}
