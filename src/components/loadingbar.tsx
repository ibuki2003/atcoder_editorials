import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Router from "next/router";

function randomInt(low: number, high: number) {
  return Math.floor(Math.random() * (high - low) + low);
}

interface Props {
  height: number;
  color: string;
}

const LoadingBar: React.FunctionComponent<Props> = (props): JSX.Element => {
  const [progress, setProgress] = useState(100);
  const [full, setFull] = useState(true);
  const interval_id = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const increment = () =>
      setProgress((p: number) => (p < 90 ? p + randomInt(2, 10) : p));
    function start_interval() {
      if (interval_id.current === null) {
        setProgress(0);
        setTimeout(() => setFull(false), 200);

        console.log("Hello");
        interval_id.current = setInterval(increment, 1000, 90);
      }
    }

    function end_interval() {
      clearInterval(interval_id.current);
      interval_id.current = null;
      setProgress(100);
      setTimeout(() => setFull(true), 200);
    }

    console.log("Foo!");
    Router.events.on("routeChangeStart", start_interval);
    Router.events.on("routeChangeComplete", end_interval);
    Router.events.on("routeChangeError", end_interval);
    return () => {
      console.log("Bye");
      Router.events.off("routeChangeStart", start_interval);
      Router.events.off("routeChangeComplete", end_interval);
      Router.events.off("routeChangeError", end_interval);
    };
  });

  return (
    <div
      style={{
        width: `${progress}%`,
        height: props.height,
        backgroundColor: props.color,
        boxShadow: `0 0 5px 0 ${props.color}`,
      }}
      className={"loading-bar" + (full ? " full" : "")}
    ></div>
  );
};

LoadingBar.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
};

export default LoadingBar;
