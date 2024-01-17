"use client";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import apiCall from "@/helpers/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./Button";
import "./movie.scss";
import toast from "react-hot-toast";

interface formErrors {
  title: string | null;
  poster: string | null;
  publishedYear: string | null;
}

interface movieProps {
  movieId: string | null;
}

const MovieForm = (props: movieProps) => {
  const [title, setTitle] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [poster, setPoster] = useState<File | null>();
  const [preview, setPreview] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmit] = useState(false);
  const { movieId } = props;

  const [errors, setErrors] = useState<formErrors>({
    title: null,
    poster: null,
    publishedYear: null,
  });

  useLayoutEffect(() => {
    if (movieId) {
      (async () => {
        try {
          setLoading(true);
          const movieData = await apiCall("movie/" + movieId);
          setTitle(movieData.data.title);
          setPreview(
            process.env.NEXT_PUBLIC_BACKEND_URL + "/" + movieData.data.poster
          );
          setPublishedYear(movieData.data.published_year);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePosterDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPoster(file);
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files && event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPoster(file);
    }
  };

  const addNewMovie = async () => {
    if (!title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "Please enter movie title",
      }));
    }
    if (!poster && !movieId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poster: "Please add movie poster",
      }));
    }
    if (!publishedYear) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        publishedYear: "Please enter movie year",
      }));
    }

    if (!title || (!poster && !movieId) || !publishedYear) {
      return;
    }

    let formData = new FormData();
    if (poster) formData.append("poster", poster);
    formData.append("title", title);
    formData.append("published_year", publishedYear);
    setSubmit(true);
    // Edit movie
    if (movieId) {
      try {
        await apiCall("movie/" + movieId, "PUT", formData);
        toast.success("Movie updated successfully!");
        router.push("/movies");
      } catch (error) {
        toast.error(
          error?.response?.data?.errorMessage || "Something went wrong!"
        );
      }
    } else {
      try {
        await apiCall("movie", "POST", formData);
        toast.success("Movie added successfully!");
        router.push("/movies");
      } catch (error) {
        toast.error(
          error?.response?.data?.errorMessage || "Something went wrong!"
        );
      } finally {
        setSubmit(false);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setPoster(null);
    setPublishedYear("");
    router.push("/movies");
  };
  return loading ? (
    <div className="flex items-center justify-center flex-1">
      <div className="spinner" />
    </div>
  ) : (
    <div className="movie-main create-movie">
      <div
        className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 fixed right-3 top-3"
        role="alert"
      ></div>
      <div className="cmovie-main cm-web">
        <h4>{movieId ? "Edit" : "Create a new movie"}</h4>
        <div
          className="cmovie-fold flex-col lg:!flex-row "
          onDrop={handlePosterDrop}
        >
          <div
            className={`upload-img mb-4 aspect-[2/3] md:w-56 ${
              errors.poster && " !border-rose-500"
            } `}
          >
            {preview ? (
              <Image
                src={preview || ""}
                width={200}
                height={300}
                alt="poster-preview"
              />
            ) : (
              <>
                <figure>
                  <Image src={"/download.png"} alt="" width={24} height={24} />
                </figure>
                <span>Drop an image here</span>
              </>
            )}
            <input type="file" onChange={handleFileSelect} />
          </div>
          <div className="cmovie-form md:w-96">
            <div className="form-group">
              <input
                type="text"
                placeholder="Title"
                className={`form-control    ${
                  errors.title && " !border-rose-500"
                } `}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              {errors.title && (
                <p className="error-message text-rose-500 py-2">
                  {errors.title}
                </p>
              )}
            </div>
            <div className="form-group pyear">
              <input
                type="number"
                placeholder="Publishing year"
                value={publishedYear}
                className={`form-control    ${
                  errors.publishedYear && " !border-rose-500"
                } `}
                onChange={(e) => setPublishedYear(e.target.value)}
              />
              {errors.publishedYear && (
                <p className="error-message text-rose-500 py-2">
                  {errors.publishedYear}
                </p>
              )}
            </div>
            <div className="action-btn">
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
              <Button
                onClick={addNewMovie}
                isLoading={submiting}
                label={"Submit"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
