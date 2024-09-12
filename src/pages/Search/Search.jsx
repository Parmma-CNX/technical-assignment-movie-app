import {
  Container,
  Heading,
  Flex,
  Input,
  Spinner,
  Grid,
  Skeleton,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchData,
  searchMultipleData,
  setSearchResults,
} from "../../features/details/detailsSlice";
import CardComponent from "../../components/CardComponent";
import Pagination from "../../components/Pagination";
import { useEffect } from "react";

function Search() {
  const dispatch = useDispatch();
  const { query, search_movies, search_result, page, isSearchLoading } =
    useSelector((state) => state.details);

  useEffect(() => {
    dispatch(searchData({ query, page }));
  }, [dispatch, query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchMultipleData(search_result));
  };

  const handleChange = (event) => {
    dispatch(setSearchResults(event.target.value));
  };

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as={"h2"} fontSize={"medium"} textTransform={"uppercase"}>
          Trending
        </Heading>
      </Flex>

      <form onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder="Search movies, tv shows..."
          _placeholder={{ color: "gray.100" }}
          value={search_result}
          onChange={handleChange}
        />
      </form>

      {isSearchLoading && (
        <Flex justifyContent={"center"} mt={"10"}>
          <Spinner size={"xl"} color="red" />
        </Flex>
      )}

      {search_movies.results?.length === 0 && !isSearchLoading && (
        <Heading textAlign={"center"} as="h3" fontSize={"sm"} mt="10px">
          No results found
        </Heading>
      )}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(4,1fr)",
          lg: "repeat(5,1fr)",
        }}
        gap={"4"}
        mt={"6"}
      >
        {search_movies &&
          search_movies?.results?.map((movie, i) =>
            isSearchLoading ? (
              <Skeleton height={300} key={i} />
            ) : (
              <CardComponent
                key={movie.id}
                item={movie}
                type={movie?.media_type}
              />
            )
          )}
      </Grid>

      {search_movies ? (
        <Pagination activePage={page} totalPages={search_movies?.total_pages} />
      ) : (
        ""
      )}
    </Container>
  );
}

export default Search;
