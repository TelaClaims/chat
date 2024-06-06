import { useRef } from "react";
import { IconButton, TextField } from "@mui/material";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const SearchInput = () => {
  const { search } = useChat();
  const { setSearch, searchMessages } = useChatDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickSearch = async () => {
    if (search.active) {
      const query = inputRef.current?.value?.trim() || "";
      if (query.length > 0 && query !== search.query) {
        setSearch({
          isSearching: true,
        });

        const messagesPagination = await searchMessages({ query });

        setSearch({
          active: true,
          query,
          results: messagesPagination,
          isSearching: false,
        });
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.value = event.target.value;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleClickSearch();
    }
  };

  const handleResetSearch = () => {
    setSearch({
      query: "",
      results: undefined,
      isSearching: false,
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <TextField
        inputRef={inputRef}
        fullWidth
        id="chat-search-messages-input"
        variant="standard"
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        label="Search by text or tag"
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleResetSearch}>
              <CloseIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          "& .MuiInput-root": {
            margin: 0,
          },
          "& .MuiFormLabel-root": {
            transform: "translate(0, 10px)",
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(0, -10px) scale(0.75)",
          },
        }}
      />
      <IconButton onClick={handleClickSearch}>
        <SearchIcon />
      </IconButton>
    </>
  );
};
