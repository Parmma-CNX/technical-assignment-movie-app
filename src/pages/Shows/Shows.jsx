import {
  Container,
  Heading,
  Grid,
  Skeleton,
  Flex,
  Select,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTvSeries } from "../../features/details/detailsSlice";
import CardComponent from "../../components/CardComponent";
import Pagination from "../../components/Pagination";
import {
  selectedSortBy,
  setActivePage,
} from "../../features/details/detailsSlice";

function Shows() {
  const dispatch = useDispatch();
  const { shows, loadingShow, page, sort_by } = useSelector(
    (state) => state.details
  );

  useEffect(() => {
    dispatch(fetchTvSeries({ page, sort_by }));
  }, [dispatch, page, sort_by]);

  const handleChange = (event) => {
    dispatch(setActivePage(1));
    dispatch(selectedSortBy(event.target.value));
  };

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my="10">
        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
          Discover TV Shows
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
        {shows &&
          shows?.results?.map((show, i) =>
            loadingShow ? (
              <Skeleton height={300} key={i} />
            ) : (
              <CardComponent key={show.id} item={show} type={"tv"} />
            )
          )}
      </Grid>
      {/* PAGINATION */}
      {shows && shows?.total_pages ? (
        <Pagination activePage={page} totalPages={shows?.total_pages} />
      ) : (
        ""
      )}
    </Container>
  );
}

export default Shows;
