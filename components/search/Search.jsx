import axios from "axios";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { ImCancelCircle } from "react-icons/im";

import { BsArrowUpCircle } from "react-icons/bs";
import dynamic from "next/dynamic";
const Spinner = dynamic(() => import("../Spinner"));
const EventList = dynamic(() => import("../event-list/EventList"));
import { serverUrl } from "../../config";
import { LoadingContext } from "../../context/Context";

function Search() {
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { loading, setLoading } = useContext(LoadingContext);
  const ref = useRef(null);
  const scrollref = useRef(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    (async () => {
      const result = await axios.get(
        `${serverUrl}/events/${page ? "?page=" + page : ""}`
      );
      setFilteredData(result.data.results);
      setTotalPages(result.data.lastPage);
      if (page > 1) {
        return (
          setFilteredData([...filteredData, ...result.data.results]),
          window &&
            window.scrollTo({
              top: scrollref.current.offsetTop,
              behavior: "smooth",
            })
        );
      }
      setLoading(true);
    })();
  }, [page, filteredData]);

  useEffect(() => {
    const word = searchInput.toLowerCase();
    (async () => {
      setLoading(true);
      const result = await axios.get(
        `${serverUrl}/events/${page ? "?page=" + page : ""}`
      );
      const filtered = result.data.results
        .filter((item) => {
          return item.title.toLowerCase().includes(word);
        })
        .slice(0, 10);
      setFilteredData(filtered);
      setLoading(false);
    })();
  }, [page, searchInput]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
  };
  // console.log("filteredData:", filteredData);

  const clearInput = async () => {
    ref.current.value = "";
    setSearchInput("");
    await fetchData();
  };

  return (
    <div className="h-screen relative items-center flex flex-col">
      <h3 className="mt-40 sm:ml-4  px-4 max-w-96 w-full sm:mx-4 p-1 font-bold text-3xl sm:text-4xl flex items-baseline">
        Search <span className="text-rose-600 px-3 py-5"> Events</span>
      </h3>
      <div className="mx-auto w-full">
        <label className="max-w-96 sm:w-4/5 mx-4  sm:ml-4 h-16 flex self-start rounded-lg px-4 items-center border">
          <input
            type="text"
            name="text"
            ref={ref}
            placeholder="Search by event Name"
            className="flex-1 h-14 bg-white outline-none max-w-96  border-gray-300 focus:shadow-outline"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchItems(e.target.value);
              }
            }}
          />
          {!loading && searchInput !== "" && (
            <ImCancelCircle
              onClick={clearInput}
              className="text-wine-600 text-4xl ml-3"
            />
          )}
        </label>
      </div>
      {!loading && filteredData?.length !== 0 ? (
        <EventList events={filteredData} />
      ) : !loading && searchInput && filteredData.length === 0 ? (
        <div className="text-center my-10 text-gray-500">
          <p className="">No event matching your search</p>
        </div>
      ) : (
        !loading &&
        filteredData.length === 0 && (
          <div className="text-center my-10 text-gray-500">
            <p className="">Event event found</p>
          </div>
        )
      )}

      {loading && (
        <div className="m-auto">
          <Spinner height={40} width={40} />
        </div>
      )}
      <BsArrowUpCircle
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        className="cursor-pointer fixed bottom-0 right-0 z-50   m-4 text-2xl text-rose-500"
      />
      <div className="flex items-center justify center">
        {filteredData.length > 6 && (
          <button
            ref={scrollref}
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1);
              }
            }}
            className="mx-auto rounded-sm bg-[#ff7aa7] my-10 text-white px-4 text-lg"
          >
            load more
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
