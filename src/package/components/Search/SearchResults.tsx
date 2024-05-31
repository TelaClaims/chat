import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MessageAttributes } from "@/package/types";

export const SearchResults = () => {
  const { search } = useChat();
  const { setSearch, goToMessage } = useChatDispatch();

  if (!search.active) return null;

  const { results } = search;

  const handleCloseSearch = () => {
    setSearch({
      active: false,
    });
  };

  const handleClickMessageToSearch = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    messageIndex: number
  ) => {
    event.preventDefault();
    setSearch({
      active: false,
    });

    goToMessage(messageIndex);
  };

  const totalResults = results?.length || 0;

  return (
    <Box height={"75%"} width={"100%"} bgcolor={"transparent"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {totalResults > 0 ? (
          <Typography ml={2} variant="body1">
            Found {totalResults} results
          </Typography>
        ) : (
          <span />
        )}
        <IconButton onClick={handleCloseSearch}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        width={"100%"}
        height={"calc(100% - 26px)"}
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {totalResults > 0 && (
          <List>
            {results!.map((result) => {
              const resultAttributes = result.attributes as MessageAttributes;
              const tags = resultAttributes.tags;
              return (
                <ListItemButton
                  key={result.sid}
                  sx={{
                    bgcolor: "rgba(12, 12, 12, 0.207);",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onClick={(e) => handleClickMessageToSearch(e, result.index)}
                >
                  <Box display={"flex"} flexDirection={"column"} width={"75%"}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {result.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        overflowWrap: "break-word",
                      }}
                    >
                      {result.body}
                    </Typography>
                    <Box
                      display={"flex"}
                      flexWrap={"wrap"}
                      gap={0.5}
                      justifyContent={"flex-start"}
                    >
                      {tags?.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="filled"
                          color="primary"
                          sx={{
                            height: "24px",
                            fontSize: 12,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      {result.dateCreated?.toLocaleDateString()}
                    </Typography>
                  </Box>
                </ListItemButton>
              );
            })}
          </List>
        )}
        {search.isSearching && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        )}
        {!search.isSearching && totalResults === 0 && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <Typography variant="h6" color="textSecondary">
              No results found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
