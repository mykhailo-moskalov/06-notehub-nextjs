import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const NotesPage = async () => {
  const queryClient = new QueryClient();
  const query = "";
  const page = 1;

  await queryClient.prefetchQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient query={query} page={page} />
    </HydrationBoundary>
  );
};

export default NotesPage;
