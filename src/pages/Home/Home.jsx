import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../../features/movies/moviesSlice";
import CardComponent from "../../components/CardComponent";
import { setTimeWindow } from "../../features/movies/moviesSlice";
function Home() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.list);
  const status = useSelector((state) => state.movies.status);
  const timeWindow = useSelector((state) => state.movies.time_window);

  useEffect(() => {
    dispatch(fetchMovies(timeWindow));
  }, [dispatch, timeWindow]);

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as={"h2"} fontSize={"medium"} textTransform={"uppercase"}>
          Trending
        </Heading>

        <Flex
          alignItems={"center"}
          gap={"2"}
          border={"1px solid teal"}
          borderRadius={"20px"}
        >
          <Box
            as="button"
            px={"3"}
            py={"1"}
            borderRadius={"20px"}
            bg={`${timeWindow === "day" ? "gray.800" : ""}`}
            onClick={() => dispatch(setTimeWindow("day"))}
          >
            Today
          </Box>
          <Box
            as="button"
            px={"3"}
            py={"1"}
            borderRadius={"20px"}
            bg={`${timeWindow === "week" ? "gray.800" : ""}`}
            onClick={() => dispatch(setTimeWindow("week"))}
          >
            This Week
          </Box>
        </Flex>
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
        {movies &&
          movies?.map((movie, i) =>
            status === "succeeded" ? (
              <CardComponent
                key={movie.id}
                item={movie}
                type={movie?.media_type}
              />
            ) : (
              <Skeleton height={300} key={i} />
            )
          )}
      </Grid>
    </Container>
  );
}

export default Home;
