"use client"

import Image from "next/image";
import axios from 'axios';
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"



export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ count: 0, entries: [] });

  // states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // search feature
  const [ searchQuery, setSearchQuery ] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.get("https://api.publicapis.org/entries");
        // console.log(results.data.count);
        // setData(results.data.entries);
        setData({ count: results.data.count, entries: results.data.entries });

        setLoading(false)
        // console.log(data)
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);


   // handle search
   const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // console.log(searchQuery);
  }

  // Filtering the data entries based on the search query.
const filteredData = searchQuery.trim() ? data.entries.filter(entry =>
  entry.API.toLowerCase().includes(searchQuery.trim().toLowerCase())
) : data.entries;

  // calculating the pagination data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // console.log(totalPages)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // a function to render pagination
  // const renderPaginationItems = () => {
  //   console.log(totalPages)
  //   let items = [];
  //   for (let number = 1; number <= totalPages; number++) {
  //     items.push(
  //       <PaginationItem key={number} active={number === currentPage}>
  //         <PaginationLink href="#" onClick={(e) => handlePageChange(e, number)} className="bg-white">
  //           {number}
  //         </PaginationLink>
  //       </PaginationItem>
  //     );
  //   }

  //   // Example logic to insert an ellipsis for a large number of pages
  //   if (totalPages > 5) {
  //     const startItems = items.slice(0, 2);
  //     const endItems = items.slice(-2);
  //     items = [...startItems, <PaginationEllipsis className="bg-white" />, ...endItems];
  //   }

  //   console.log(items)
  //   return items;
  // };

  const renderPaginationItems = () => {
    let items = [];
    let leftSide = currentPage - 2;
    let rightSide = currentPage + 2;
  
    for (let number = 1; number <= totalPages; number++) {
      if (number === 1 || number === totalPages || (number >= leftSide && number <= rightSide)) {
        items.push(
          <PaginationItem key={number}>
            <PaginationLink href="#" onClick={(e) => handlePageChange(e, number)} className="bg-white">
              {number}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
  
    // Logic to add ellipses where there are skipped page numbers
    const paginationItemsWithEllipses = [];
    let previousItem = null;
    for (const item of items) {
      const pageNumber = parseInt(item.key);
      if (previousItem) {
        const previousPageNumber = parseInt(previousItem.key);
        if (pageNumber - previousPageNumber === 2) {
          // If there's only one page number between the current and the previous item, add that page number instead of an ellipsis
          paginationItemsWithEllipses.push(
            <PaginationItem key={previousPageNumber + 1}>
              <PaginationLink href="#" onClick={(e) => handlePageChange(e, previousPageNumber + 1)} className="bg-white">
                {previousPageNumber + 1}
              </PaginationLink>
            </PaginationItem>
          );
        } else if (pageNumber - previousPageNumber !== 1) {
          // If there's more than one page number between the current and the previous item, add an ellipsis
          paginationItemsWithEllipses.push(<PaginationEllipsis className="bg-white" />);
        }
      }
      paginationItemsWithEllipses.push(item);
      previousItem = item;
    }
  
    return paginationItemsWithEllipses;
  };
  

  // handle page change
  const handlePageChange = (e, number) => {
    e.preventDefault();
    setCurrentPage(number);
  };  


  return (
    // <main className="flex min-h-screen flex-wrap items-center justify-between p-24">
    <main className="flex flex-col min-h-screen bg-slate-900  p-24">
      <h2 className="text-white font-bold text-3xl mb-8">Publicly Available APIs</h2>
      <div className="flex justify-end mb-4">
      <input
  type="text"
  placeholder="Search APIs..."
  value={searchQuery}
  onChange={handleSearch}
  className="search-input py-3 px-10 rounded-sm"
/>

      </div>
      {loading ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4">
          <Skeleton />
          <Skeleton />
          <Skeleton className="h-[200px] w-[400px] rounded-xl" />
          <Skeleton />
          <Skeleton />
          <Skeleton className="h-[200px] w-[400px] rounded-xl" />
          <Skeleton />
          <Skeleton />
          <Skeleton className="h-[200px] w-[400px] rounded-xl" />
        </div>
      ) : (<div className="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4">

        {currentItems.map((entry, index) => (
          <Card key={`${entry.API}-${index}`}>
            <CardHeader>
              <CardTitle>{entry.API}</CardTitle>
              <CardDescription>
                <span className="flex gap-3">
                  {entry.Auth !== "" ? (<span>Auth: {entry.Auth}</span>) : ""}
                  {entry.Cors !== "yes" ? (<span>Cors: No</span>) : (<span>Cors: Yes</span>)}
                  {entry.HTTPS === true ? (<span>HTTPS: True</span>) : ""}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{entry.Description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className='bg-black text-white' onClick={() => { window.open(entry.Link, "_blank") }}>Visit</Button>
              <Badge variant="outline">{entry.Category}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {!loading ? (<Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => handlePageChange(e, currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white"
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => handlePageChange(e, currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      ) : ("")}

    </main>
  );
}
