"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import apiCall from "@/helpers/api";
import MovieForm from "@/app/components/Movie";



const EditMoviePage = (props: any) => {
  return <MovieForm movieId={props.params["movie-id"]} />;
};

export default EditMoviePage;
