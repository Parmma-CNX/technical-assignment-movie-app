import { useEffect } from "react";
import { useFireStore } from "../../services/firestore";
import { useSelector, useDispatch } from "react-redux";
import { Container, Flex, Heading, Spinner, Grid } from "@chakra-ui/react";
import { setWatchList, setLoading } from "../../features/movies/moviesSlice.js";
import WatchlistCard from "../../components/WatchlistCard";
function Watchlists() {
  const { getWatchList } = useFireStore();
  const { user } = useSelector((state) => state.auth);
  const { watchlist, isLoading } = useSelector((state) => state.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.uid) {
      getWatchList(user?.uid)
        .then((data) => {
          dispatch(setWatchList(data));
        })
        .catch((err) => console.error(err))
        .finally(() => dispatch(setLoading(false)));
    }
  }, [dispatch, getWatchList, user?.uid]);

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as={"h2"} fontSize={"medium"} textTransform={"uppercase"}>
          Watchlist
        </Heading>
      </Flex>

      {isLoading && (
        <Flex justify={"center"} mt="10">
          <Spinner size={"xl"} color="red"></Spinner>
        </Flex>
      )}

      {!isLoading && watchlist?.length === 0 && (
        <Flex justify={"center"} mt="10">
          <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
            Watchlist is Empty
          </Heading>
        </Flex>
      )}
      {!isLoading && watchlist?.length > 0 && (
        <Grid templateColumns={{ base: "1fr" }} gap={"4"}>
          {watchlist?.map((item) => (
            <WatchlistCard key={item.id} item={item} type={item?.type} />
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Watchlists;
