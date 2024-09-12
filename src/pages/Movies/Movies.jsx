import {
  Container,
  Heading,
  Grid,
  Skeleton,
  Flex,
  Select,
} from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscoverMovies } from "../../features/details/detailsSlice";
import CardComponent from "../../components/CardComponent";
import Pagination from "../../components/Pagination";
import {
  selectedSortBy,
  setActivePage,
} from "../../features/details/detailsSlice";

const Movies = memo(function Movies() {
  const dispatch = useDispatch();
  const { discovers, loadingDiscoverMovie, page, sort_by } = useSelector(
    (state) => state.details
  );

  useEffect(() => {
    dispatch(fetchDiscoverMovies({ page, sort_by }));
  }, [dispatch, page, sort_by]);

  const handleChange = (event) => {
    dispatch(setActivePage(1));
    dispatch(selectedSortBy(event.target.value));
  };

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my="10">
        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
          Discover Movies
        </Heading>

        <Select w={"130ox"} onChange={handleChange}>
          <option value="popularity.desc">Popular</option>
          <option value="vote_average.desc&vote_count.gte=1000">
            Top Rated
          </option>
          <option value="primary_release_date.desc">Release</option>
        </Select>
      </Flex>
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(4,1fr)",
          lg: "repeat(5,1fr)",
        }}
        gap={"4"}
      >
        {discovers &&
          discovers?.results?.map((movie, i) =>
            loadingDiscoverMovie ? (
              <Skeleton height={300} key={i} />
            ) : (
              <CardComponent key={movie.id} item={movie} type={"movie"} />
            )
          )}
      </Grid>
      {/* PAGINATION */}
      {discovers && discovers?.total_pages ? (
        <Pagination activePage={page} totalPages={discovers?.total_pages} />
      ) : (
        ""
      )}
    </Container>
  );
});

export default Movies;
