import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: var(--background-light);
  border-radius: 25px;
  margin: 10px 0;
  border: 1px solid var(--color-grey);
`;

const SearchInput = styled.input`
  width: 100%;
  outline: none;
  background-color: transparent;
  padding: 10px;
  border: none;
  font-size: 14px;
`;

export default function SearchContainer() {
  return (
    <SearchInputContainer>
      <SearchInput placeholder="Search" />
      <SearchIcon style={{ marginRight: "10px" }} />
    </SearchInputContainer>
  );
}
