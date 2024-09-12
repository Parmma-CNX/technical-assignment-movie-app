import { Button, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setActivePage } from "../features/details/detailsSlice";

function Pagination({ activePage, totalPages }) {
  const dispatch = useDispatch();
  return (
    <Flex gap={"2"} alignItems={"center"}>
      <Flex gap={"2"} maxW={"250px"} my="10">
        <Button
          onClick={() => dispatch(setActivePage(activePage - 1))}
          isDisabled={activePage === 1}
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => dispatch(setActivePage(activePage + 1))}
          isDisabled={activePage === totalPages}
        >
          {">>"}
        </Button>
      </Flex>
      <Flex gap="1">
        <Text>{activePage}</Text>
        <Text>of</Text>
        <Text>{totalPages}</Text>
      </Flex>
    </Flex>
  );
}

Pagination.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default Pagination;
