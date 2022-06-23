import { useSession } from "next-auth/react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { postVote } from "../RedditAPI";

const useMutate = (mutationAction) => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const voteMutation = useMutation(({ vote, id }: any) => postVote(vote, id), {
    onMutate: async (update) => {
      if (update.id.substring(0, 3) === "t3_") {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries();
        // Snapshot the previous value
        const previousData = queryClient.getQueriesData(["feed"]);

        // Optimistically update to the new value
        queryClient.setQueriesData(["feed"], (oldData: any) => {
          console.log(update, update.id, oldData);
          let newData = oldData;
          if (newData) {
            let newPages = oldData?.pages?.map((page) => {
              return {
                ...page,
                filtered: page?.filtered?.map((post) => {
                  if (update.id === post?.data?.name) {
                    console.log("FOUND!", post?.data?.title);
                    post.data["likes"] = update.vote;
                  }
                  return post;
                }),
              };
            });
            newData = { ...newData, pages: newPages };
            console.log("newData", newData);
          }
          return newData;
        });

        return { previousData };
      }
    },
    onSuccess: (data: any) => {
      if (data.id.substring(0, 3) === "t3_") {
        console.log("SUCCESS VOTE", session?.user?.name, data);
        if (session?.user?.name) {
          data.vote == 1 &&
            queryClient.invalidateQueries([
              "feed",
              session.user.name,
              "SELF",
              session.user.name,
              "upvoted",
            ]);
          data.vote == -1 &&
            queryClient.invalidateQueries([
              "feed",
              session.user.name,
              "SELF",
              session.user.name,
              "downvoted",
            ]);
        } else {
          console.log("ERR NO USER");
          queryClient.invalidateQueries(["feed"]);
        }
      }
    },
    onError: (err, update, context: any) => {
      console.log("err", err);
      if (update.id.substring(0, 3) === "t3_") {
        queryClient.setQueriesData(["feed"], context.previousData);
      }
    },
  });

  return { voteMutation };
};

export default useMutate;
