import { useRef } from "react";
import { IconButton, TextField } from "@mui/material";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const Search = () => {
  const { search } = useChat();
  const { setSearch, searchMessages, resetSearchMessages } = useChatDispatch();
  const inputRef = useRef<string>(search.query || "");

  const handleClickSearch = async () => {
    if (search.active) {
      const query = inputRef.current.trim();
      if (query.length > 0 && query !== search.query) {
        setSearch({
          isSearching: true,
          results: [],
        });

        const results = await searchMessages({ query });

        setSearch({
          active: true,
          query,
          results,
          isSearching: false,
        });
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputRef.current = event.target.value;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleClickSearch();
    }
  };

  const handleResetSearch = () => {
    resetSearchMessages();
  };

  return (
    <>
      <TextField
        fullWidth
        id="chat-search-messages-input"
        variant="standard"
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        defaultValue={search.query}
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
            transform: "translate(0, 10px)", // Ajustar aquí para mover la etiqueta
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(0, -10px) scale(0.75)", // Ajustar aquí para mover la etiqueta cuando se reduce
          },
        }}
      />
      <IconButton onClick={handleClickSearch}>
        <SearchIcon />
      </IconButton>
    </>
  );
};
