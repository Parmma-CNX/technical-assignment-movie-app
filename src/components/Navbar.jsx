import {
  Avatar,
  Box,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginWithGoogle, logoutFromApp } from "../features/auth/authSlice";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleLogin = () => {
    dispatch(loginWithGoogle());
  };

  const handleLogout = () => {
    dispatch(logoutFromApp());
  };

  return (
    <>
      <Box py={"4"} mb={"2"}>
        <Container maxW={"container.xl"}>
          <Flex justifyContent={"space-between"}>
            <Link to="/">
              <Box
                fontSize={"2xl"}
                fontWeight={"bold"}
                color={"red"}
                letterSpacing={"widset"}
                fontFamily={"mono"}
              >
                PMMOVIES
              </Box>
            </Link>
            {/* DESKTOP */}
            <Flex
              gap={"4"}
              alignItems={"center"}
              display={{ base: "none", md: "flex" }}
            >
              <Link to="/">Home</Link>
              <Link to="/movies">Movies</Link>
              <Link to="/shows">TV Shows</Link>
              <Link to="/search">
                <SearchIcon fontSize={"xl"} />
              </Link>
              {user && (
                <Menu>
                  <MenuButton>
                    <Avatar
                      bg={"red.500"}
                      color={"white"}
                      size={"sm"}
                      name={user?.email}
                    />
                  </MenuButton>
                  <MenuList>
                    <Link to="/watchlist">
                      <MenuItem>Watchlist</MenuItem>
                    </Link>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}

              {!user && (
                <Avatar
                  size={"sm"}
                  bg={"gray.800"}
                  as="button"
                  onClick={handleLogin}
                ></Avatar>
              )}
            </Flex>
            {/* Mobile */}
            <Flex
              display={{ base: "flex", md: "none" }}
              alignItems={"center"}
              gap="4"
            >
              <Link to="/search">
                <SearchIcon fontSize={"xl"} />
              </Link>
              <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
              <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg={"black"}>
                  <DrawerCloseButton />
                  <DrawerHeader>
                    {user ? (
                      <Flex alignItems="center" gap="2">
                        <Avatar bg="red.500" size={"sm"} name={user?.email} />
                        <Box fontSize={"sm"}>
                          {user?.displayName || user?.email}
                        </Box>
                      </Flex>
                    ) : (
                      <Avatar
                        size={"sm"}
                        bg="gray.800"
                        as="button"
                        onClick={handleLogin}
                      />
                    )}
                  </DrawerHeader>

                  <DrawerBody>
                    <Flex flexDirection={"column"} gap={"4"} onClick={onClose}>
                      <Link to="/">Home</Link>
                      <Link to="/movies">Movies</Link>
                      <Link to="/shows">TV Shows</Link>
                      {user && (
                        <>
                          <Link to="/watchlist">Watchlist</Link>
                          <Button
                            variant={"outline"}
                            colorScheme="red"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </>
                      )}
                    </Flex>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export default Navbar;
