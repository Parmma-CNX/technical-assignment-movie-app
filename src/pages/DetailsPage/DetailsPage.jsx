import {
  Box,
  CircularProgressLabel,
  CircularProgress,
  Container,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  Button,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {
  fetchDetails,
  fetchVideos,
  setToWatchList,
} from "../../features/details/detailsSlice";
import {
  imagePath,
  imagePathOriginal,
} from "../../features/movies/moviesSlice";
import {
  CalendarIcon,
  CheckCircleIcon,
  SmallAddIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  ratingToPercentage,
  resolveRatingColor,
  minutesTohours,
} from "../../utils/helpers";
import { fetchCredits } from "../../features/credits/creditsSlice";
import VideoComponent from "../../components/VideoComponent";
import { useFireStore } from "../../services/firestore.js";

function DetailsPage() {
  const { type, id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const { addToWatchlist, checkIfInWatchList, removeFromWatchList } =
    useFireStore();
  const { details, status, videos, isInWatchList } = useSelector(
    (state) => state.details
  );
  const casts = useSelector((state) => state.credits.credits.cast);
  const hasFetchedData = useRef(false);
  const title = details?.name || details?.title;
  const releaseDate =
    type === "tv" ? details?.first_air_date : details?.release_date;
  const video = videos?.results?.find((video) => video?.type === "Trailer");
  const allVideos = videos?.results
    ?.filter((video) => video?.type !== "Trailer")
    ?.slice(0, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchDetails({ type, id })),
          dispatch(fetchCredits({ type, id })),
          dispatch(fetchVideos({ type, id })),
        ]);
      } catch (error) {
        console.log(error, "error");
      }
    };

    if (type && id) {
      fetchData();
      hasFetchedData.current = true;
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (!user) {
      dispatch(setToWatchList(false));
    }
    checkIfInWatchList(user?.uid, id).then((data) => {
      dispatch(setToWatchList(data));
    });
  }, [id, user, dispatch, checkIfInWatchList]);

  const handleSaveToWatchlist = async () => {
    const data = {
      id: details?.id,
      title: details?.title || details?.name,
      type: type,
      poster_path: details?.poster_path,
      release_date: releaseDate,
      vote_average: details?.vote_average,
      overview: details?.overview,
    };

    const dataId = details?.id?.toString();

    if (user) {
      await addToWatchlist(user?.uid, dataId, data);
      const isSetToWatchList = await checkIfInWatchList(user?.uid, dataId);
      dispatch(setToWatchList(isSetToWatchList));
    } else {
      toast({
        title: "Login to add to watchlist",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleRemoveFromWatchlist = async () => {
    await removeFromWatchList(user?.uid, id);
    const isSetToWatchList = await checkIfInWatchList(user?.uid, id);
    dispatch(setToWatchList(isSetToWatchList));
  };

  if (status === "loading") {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} color="red" />
      </Flex>
    );
  }

  return (
    <Box>
      <Box
        background={`linear-gradient(rgba(0,0,0,.88),rgba(0,0,0,.88)), url(${imagePathOriginal}${details?.backdrop_path})`}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        w={"100%"}
        h={{ base: "auto", md: "500px" }}
        py={"2"}
        zIndex={"-1"}
        display={"flex"}
        alignItems={"center"}
      >
        <Container maxW={"container.xl"}>
          <Flex
            alignItems={"center"}
            gap={"10"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Image
              height={"450px"}
              borderRadius={"sm"}
              src={`${imagePath}${details?.poster_path}`}
            />
            <Box>
              <Heading fontSize={"3xl"}>
                {title}{" "}
                <Text as="span" fontWeight={"normal"} color={"gray.400"}>
                  {releaseDate ? new Date(releaseDate).getFullYear() : ""}
                </Text>
              </Heading>

              <Flex alignItems={"center"} gap={"4"} mt={1} mb={5}>
                <Flex alignItems={"center"}>
                  <CalendarIcon mr={"2"} color={"gray.400"} />
                  <Text fontSize={"sm"}>
                    {new Date(releaseDate).toLocaleDateString("en-US")} (US)
                  </Text>
                </Flex>

                {type === "movie" && (
                  <>
                    <Box>*</Box>
                    <Flex alignItems={"center"}>
                      <TimeIcon mr="2" color={"gray.400"} />
                      <Text fontSize={"sm"}>
                        {minutesTohours(details?.runtime)}
                      </Text>
                    </Flex>
                  </>
                )}
              </Flex>

              <Flex alignItems={"center"} gap={"4"}>
                <CircularProgress
                  value={ratingToPercentage(details?.vote_average)}
                  bg={"gray.800"}
                  borderRadius={"full"}
                  p={"0.5"}
                  size={"70px"}
                  color={resolveRatingColor(details?.vote_average)}
                  thickness={"6px"}
                >
                  <CircularProgressLabel>
                    {ratingToPercentage(details?.vote_average)}{" "}
                    <Box as="span" fontSize={"10px"}>
                      %
                    </Box>
                  </CircularProgressLabel>
                </CircularProgress>
                <Text display={{ base: "none", md: "initial" }}>
                  User Score
                </Text>
                {isInWatchList ? (
                  <Button
                    leftIcon={<CheckCircleIcon />}
                    colorScheme="green"
                    variant={"outline"}
                    onClick={handleRemoveFromWatchlist}
                  >
                    In watchlist
                  </Button>
                ) : (
                  <Button
                    leftIcon={<SmallAddIcon />}
                    variant={"outline"}
                    onClick={handleSaveToWatchlist}
                  >
                    Add to watchlist
                  </Button>
                )}
              </Flex>
              <Text
                color={"gray.400"}
                fontSize={"sm"}
                fontStyle={"italic"}
                my="5"
              >
                {details?.tagline}
              </Text>
              <Heading fontSize={"xl"} mb={"3"}>
                Overview
              </Heading>
              <Text fontSize={"md"} mb={"3"}>
                {details?.overview}
              </Text>
              <Flex mt="6" gap="2">
                {details?.genres?.map((genre) => (
                  <Badge key={genre?.id} p={"1"}>
                    {genre?.name}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container maxWidth={"container.xl"} pb={"10"}>
        <Heading
          as={"h2"}
          fontSize={"md"}
          textTransform={"uppercase"}
          mt={"10"}
        >
          Cast
        </Heading>
        <Flex mt="5" mb="10" overflowX={"scroll"} gap={"5"}>
          {casts?.slice(0, 10).length === 0 && <Text>No cast found</Text>}
          {casts &&
            casts?.slice(0, 10).map((item) => (
              <Box key={item?.id} minW={"150px"}>
                <Image
                  src={`${imagePath}${item?.profile_path}`}
                  w={"100%"}
                  height={"225px"}
                  objectFit={"cover"}
                  borderRadius={"sm"}
                ></Image>
              </Box>
            ))}
        </Flex>
        <Heading
          as={"h2"}
          fontSize={"md"}
          textTransform={"uppercase"}
          mt={"10"}
          mb={"5"}
        >
          videos
        </Heading>
        {video && <VideoComponent id={video?.key} />}

        <Flex mt="5" mb="10" overflowX={"scroll"} gap={"5"}>
          {allVideos &&
            allVideos?.map((item) => (
              <Box key={item?.key} minWidth={"290px"}>
                <VideoComponent id={item?.key} small />
                <Text fontSize={"sm"} fontWeight={"bold"} mt="2" noOfLines={2}>
                  {item?.name}
                </Text>
              </Box>
            ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default DetailsPage;
