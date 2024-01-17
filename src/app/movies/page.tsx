"use client";

import apiCall from "@/helpers/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import "./style.scss";

interface IMovies {
  _id: string;
  poster: string;
  title: string;
  published_year: string;
}

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const moviesData = await apiCall(
          `movie?page=${page}&sort=published_year&sortOrder=-1`,
          "GET"
        );
        setMovies(moviesData.data);
        setTotal(moviesData.total);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const handleLogout = () => {
    Cookies.remove("user");
    router.push("/login");
  };

  const totalDocs = Array.from(
    { length: Math.ceil(total / 10) },
    (_, index) => index + 1
  );

  return loading ? (
    <div className="flex items-center justify-center flex-1">
      <div className="spinner"></div>
    </div>
  ) : (
    <div className="movie-main movie-list-screen flex items-center justify-center flex-1">
      {!movies || !movies.length ? (
        <div className="empty-screen">
          <h2>Your movie list is empty</h2>
          <Link className="mprimary-btn" href="/add-movie">
            Add a new movie
          </Link>
        </div>
      ) : (
        <div className="ml-main">
          <div className="ml-header">
            <h4>
              My movies
              <Link href="/add-movie">
                <Image
                  src="plus-circle.svg"
                  alt="Vercel Logo"
                  width={32}
                  height={32}
                />
              </Link>
            </h4>
            <span className="logout cursor-pointer" onClick={handleLogout}>
              Logout{" "}
              <span>
                <Image
                  src="logout.svg"
                  alt="Vercel Logo"
                  width={32}
                  height={32}
                />
              </span>
            </span>
          </div>
          <div className="ml-body">
            <div className="ml-lists row !justify-evenly">
              {movies.map((movie: IMovies) => {
                return (
                  <a
                    className="xl:w-1/5 lg:w-1/4 md:w-1/2 sm-1 mb-4 ml-list-item aspect-[2/3] !mx-1 hover:!bg-primaryShade"
                    href={"/movies/" + movie._id}
                    key={movie._id}
                  >
                    <figure>
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_URL +
                          "/" +
                          movie.poster
                        }
                        alt="Vercel Logo"
                        width={1000}
                        height={500}
                      />
                    </figure>
                    <div className="mdetail">
                      <h5>{movie.title}</h5>
                      <span>{movie.published_year}</span>
                    </div>
                  </a>
                );
              })}
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li
                  className="page-item"
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                >
                  <span
                    className={`page-link ${
                      page <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                    }`}
                  >
                    Prev
                  </span>
                </li>
                {totalDocs.map((pageNumber) => {
                  return (
                    <li
                      className={`page-item ${
                        page == pageNumber ? "active" : ""
                      }`}
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                    >
                      <a className="page-link index" href="#">
                        {pageNumber}
                      </a>
                    </li>
                  );
                })}

                <li
                  className="page-item"
                  onClick={() => {
                    if (page < totalDocs.length) {
                      setPage(page + 1);
                    }
                  }}
                >
                  <span
                    className={`page-link ${
                      page >= totalDocs.length
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                    }`}
                  >
                    Next
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
